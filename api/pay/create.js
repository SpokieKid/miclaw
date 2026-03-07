const {
  getBaseUrl,
  getClientIp,
  getWechatConfig,
  wechatRequest,
} = require('../_lib/wechatpay')

function json(res, status, payload) {
  res.status(status).json(payload)
}

function generateOutTradeNo() {
  const now = new Date()
  const stamp = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0'),
  ].join('')

  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `EINCLAW${stamp}${random}`.slice(0, 32)
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const config = getWechatConfig()
    const body = typeof req.body === 'object' && req.body ? req.body : {}
    const channel = body.channel === 'mweb' ? 'mweb' : 'native'
    const contact = typeof body.contact === 'string' ? body.contact.trim() : ''

    if (!contact) {
      return json(res, 400, { error: 'Contact is required' })
    }

    const attach = JSON.stringify({ contact }).slice(0, 127)
    const outTradeNo = generateOutTradeNo()
    const amountFen = 900
    const baseUrl = getBaseUrl(req)
    const notifyUrl = config.notifyUrl || `${baseUrl}/api/pay/notify`
    const payload = {
      appid: config.appId,
      mchid: config.mchId,
      description: 'EinClaw 早鸟资格',
      out_trade_no: outTradeNo,
      notify_url: notifyUrl,
      attach,
      amount: {
        total: amountFen,
        currency: 'CNY',
      },
    }

    if (channel === 'mweb') {
      payload.scene_info = {
        payer_client_ip: getClientIp(req),
        h5_info: {
          type: 'Wap',
          app_name: config.h5AppName,
          app_url: config.h5AppUrl || baseUrl,
        },
      }
    }

    const apiPath = channel === 'mweb'
      ? '/v3/pay/transactions/h5'
      : '/v3/pay/transactions/native'

    const result = await wechatRequest({
      method: 'POST',
      canonicalUrl: apiPath,
      bodyObject: payload,
      config,
    })

    return json(res, 200, {
      provider: 'wechat',
      outTradeNo,
      amountFen,
      channel,
      codeUrl: result.code_url || null,
      h5Url: result.h5_url || null,
    })
  } catch (error) {
    console.error('wechat_pay_create_failed', error)
    return json(res, error.statusCode || 500, {
      error: error.message || 'Failed to create WeChat Pay order',
      detail: error.responseBody || null,
    })
  }
}
