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

function getWechatConfig() {
  return {
    mchId: getRequiredEnv('WECHAT_PAY_MCH_ID'),
    appId: getRequiredEnv('WECHAT_PAY_APP_ID'),
    serialNo: getRequiredEnv('WECHAT_PAY_SERIAL_NO'),
    privateKey: normalizePem(getRequiredEnv('WECHAT_PAY_PRIVATE_KEY')),
    apiV3Key: getRequiredEnv('WECHAT_PAY_API_V3_KEY'),
    platformPublicKey: normalizePem(getRequiredEnv('WECHAT_PAY_PLATFORM_PUBLIC_KEY')),
    notifyUrl: process.env.WECHAT_PAY_NOTIFY_URL,
    webhookUrl: process.env.PAYMENT_NOTIFY_FORWARD_URL,
    h5AppName: process.env.WECHAT_PAY_H5_APP_NAME || 'EinClaw',
    h5AppUrl: process.env.WECHAT_PAY_H5_APP_URL,
  }
}

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return `${proto}://${host}`
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }

  return req.socket?.remoteAddress || '127.0.0.1'
}

function getNonce() {
  return crypto.randomBytes(16).toString('hex')
}

function signMessage(message, privateKey) {
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(message)
  signer.end()
  return signer.sign(privateKey, 'base64')
}

function verifyMessage(message, signature, publicKey) {
  const verifier = crypto.createVerify('RSA-SHA256')
  verifier.update(message)
  verifier.end()
  return verifier.verify(publicKey, signature, 'base64')
}

function buildAuthorization({ method, canonicalUrl, body, config }) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = getNonce()
  const payload = `${method}\n${canonicalUrl}\n${timestamp}\n${nonce}\n${body}\n`
  const signature = signMessage(payload, config.privateKey)

  return `WECHATPAY2-SHA256-RSA2048 mchid="${config.mchId}",nonce_str="${nonce}",signature="${signature}",timestamp="${timestamp}",serial_no="${config.serialNo}"`
}

async function wechatRequest({ method, canonicalUrl, bodyObject, config }) {
  const body = bodyObject ? JSON.stringify(bodyObject) : ''
  const authorization = buildAuthorization({ method, canonicalUrl, body, config })
  const response = await fetch(`https://api.mch.weixin.qq.com${canonicalUrl}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
    body: body || undefined,
  })

  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.detail || `WeChat Pay request failed with ${response.status}`
    const error = new Error(message)
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
    return JSON.stringify(req.body)
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

function decryptWechatResource(resource, apiV3Key) {
  const ciphertext = Buffer.from(resource.ciphertext, 'base64')
  const authTag = ciphertext.subarray(ciphertext.length - 16)
  const data = ciphertext.subarray(0, ciphertext.length - 16)
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(apiV3Key, 'utf8'),
    Buffer.from(resource.nonce, 'utf8'),
  )

  if (resource.associated_data) {
    decipher.setAAD(Buffer.from(resource.associated_data, 'utf8'))
  }

  decipher.setAuthTag(authTag)
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
  return JSON.parse(decrypted.toString('utf8'))
}

function verifyWechatSignature({ timestamp, nonce, signature, body, platformPublicKey }) {
  if (!timestamp || !nonce || !signature) {
    return false
  }

  const message = `${timestamp}\n${nonce}\n${body}\n`
  return verifyMessage(message, signature, platformPublicKey)
}

function parseAttach(attach) {
  if (!attach) return null

  try {
    return JSON.parse(attach)
  } catch {
    return { raw: attach }
  }
}

function buildOrderSnapshot(data) {
  return {
    provider: 'wechat',
    outTradeNo: data.out_trade_no,
    transactionId: data.transaction_id || null,
    tradeState: data.trade_state,
    tradeStateDesc: data.trade_state_desc || '',
    successTime: data.success_time || null,
    amountFen: data.amount?.total ?? null,
    payer: data.payer || null,
    attach: parseAttach(data.attach),
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
  buildOrderSnapshot,
  decryptWechatResource,
  forwardPaidOrder,
  getBaseUrl,
  getClientIp,
  getWechatConfig,
  parseAttach,
  readRawBody,
  verifyWechatSignature,
  wechatRequest,
}
