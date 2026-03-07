const crypto = require('node:crypto')

function getRequiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
  return value
}

function normalizePem(value) {
  return value.replace(/\\n/g, '\n').trim()
}

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return `${proto}://${host}`
}

function getAlipayConfig() {
  return {
    appId: getRequiredEnv('ALIPAY_APP_ID'),
    privateKey: normalizePem(getRequiredEnv('ALIPAY_APP_PRIVATE_KEY')),
    publicKey: normalizePem(getRequiredEnv('ALIPAY_PUBLIC_KEY')),
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
    notifyUrl: process.env.ALIPAY_NOTIFY_URL,
    returnUrl: process.env.ALIPAY_RETURN_URL,
    sellerId: process.env.ALIPAY_SELLER_ID || '',
    webhookUrl: process.env.PAYMENT_NOTIFY_FORWARD_URL,
  }
}

function formatTimestamp(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function sortObjectEntries(input) {
  return Object.entries(input)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
}

function buildSignContent(params) {
  return sortObjectEntries(params)
    .filter(([key]) => key !== 'sign' && key !== 'sign_type')
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

function signContent(content, privateKey) {
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(content, 'utf8')
  signer.end()
  return signer.sign(privateKey, 'base64')
}

function verifyContent(content, signature, publicKey) {
  const verifier = crypto.createVerify('RSA-SHA256')
  verifier.update(content, 'utf8')
  verifier.end()
  return verifier.verify(publicKey, signature, 'base64')
}

function buildCommonParams({ method, bizContent, notifyUrl, returnUrl, config }) {
  return {
    app_id: config.appId,
    method,
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: formatTimestamp(),
    version: '1.0',
    format: 'JSON',
    notify_url: notifyUrl,
    return_url: returnUrl,
    biz_content: JSON.stringify(bizContent),
  }
}

function buildGatewayUrl(params, config) {
  const sign = signContent(buildSignContent(params), config.privateKey)
  const query = new URLSearchParams()

  for (const [key, value] of sortObjectEntries({ ...params, sign })) {
    query.set(key, String(value))
  }

  return `${config.gateway}?${query.toString()}`
}

async function alipayOpenApiRequest({ method, bizContent, config }) {
  const params = buildCommonParams({
    method,
    bizContent,
    config,
  })
  const sign = signContent(buildSignContent(params), config.privateKey)
  const form = new URLSearchParams()

  for (const [key, value] of sortObjectEntries({ ...params, sign })) {
    form.set(key, String(value))
  }

  const response = await fetch(config.gateway, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: form.toString(),
  })

  const text = await response.text()
  let data = null

  try {
    data = JSON.parse(text)
  } catch {
    const error = new Error('Alipay gateway returned invalid JSON')
    error.responseBody = text
    throw error
  }

  if (!response.ok) {
    const error = new Error(`Alipay gateway request failed with ${response.status}`)
    error.statusCode = response.status
    error.responseBody = data
    throw error
  }

  return data
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8')
  }

  if (typeof req.body === 'string') {
    return req.body
  }

  if (req.body && typeof req.body === 'object') {
    return new URLSearchParams(req.body).toString()
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf8')
}

function parseFormEncoded(rawBody) {
  const params = new URLSearchParams(rawBody)
  const result = {}

  for (const [key, value] of params.entries()) {
    result[key] = value
  }

  return result
}

function verifyAlipaySignature(params, publicKey) {
  const signature = params.sign
  if (!signature) {
    return false
  }

  const content = buildSignContent(params)
  return verifyContent(content, signature, publicKey)
}

function mapAlipayTradeState(tradeStatus) {
  const map = {
    WAIT_BUYER_PAY: 'WAIT_BUYER_PAY',
    TRADE_SUCCESS: 'TRADE_SUCCESS',
    TRADE_FINISHED: 'TRADE_FINISHED',
    TRADE_CLOSED: 'TRADE_CLOSED',
  }

  return map[tradeStatus] || tradeStatus || 'UNKNOWN'
}

function buildOrderSnapshot(data) {
  let contact = null
  if (data.passback_params) {
    try {
      contact = decodeURIComponent(data.passback_params)
    } catch {
      contact = data.passback_params
    }
  }

  return {
    provider: 'alipay',
    outTradeNo: data.out_trade_no || null,
    transactionId: data.trade_no || null,
    tradeState: mapAlipayTradeState(data.trade_status),
    tradeStateDesc: data.msg || '',
    successTime: data.send_pay_date || data.gmt_payment || null,
    amountFen: data.total_amount ? Math.round(Number(data.total_amount) * 100) : null,
    payer: {
      buyerId: data.buyer_id || null,
      buyerLogonId: data.buyer_logon_id || null,
    },
    attach: contact ? { contact } : null,
  }
}

async function forwardPaidOrder(config, snapshot) {
  if (!config.webhookUrl) return

  await fetch(config.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snapshot),
  })
}

module.exports = {
  alipayOpenApiRequest,
  buildCommonParams,
  buildGatewayUrl,
  buildOrderSnapshot,
  buildSignContent,
  forwardPaidOrder,
  getAlipayConfig,
  getBaseUrl,
  parseFormEncoded,
  readRawBody,
  verifyAlipaySignature,
}
