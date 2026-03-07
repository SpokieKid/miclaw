const {
  buildCommonParams,
  buildGatewayUrl,
  getAlipayConfig,
  getBaseUrl,
} = require('../_lib/alipay')

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
  return `EINCLAWALI${stamp}${random}`.slice(0, 64)
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const config = getAlipayConfig()
    const body = typeof req.body === 'object' && req.body ? req.body : {}
    const channel = body.channel === 'wap' ? 'wap' : 'page'
    const contact = typeof body.contact === 'string' ? body.contact.trim() : ''

    if (!contact) {
      return json(res, 400, { error: 'Contact is required' })
    }

    const outTradeNo = generateOutTradeNo()
    const amountFen = 900
    const baseUrl = getBaseUrl(req)
    const notifyUrl = config.notifyUrl || `${baseUrl}/api/alipay/notify`
    const returnUrl = config.returnUrl || `${baseUrl}/?pay_result=alipay`
    const bizContent = {
      out_trade_no: outTradeNo,
      product_code: channel === 'wap' ? 'QUICK_WAP_WAY' : 'FAST_INSTANT_TRADE_PAY',
      total_amount: (amountFen / 100).toFixed(2),
      subject: 'EinClaw 早鸟资格',
      body: 'EinClaw early bird reservation',
      passback_params: encodeURIComponent(contact),
    }

    const params = buildCommonParams({
      method: channel === 'wap' ? 'alipay.trade.wap.pay' : 'alipay.trade.page.pay',
      bizContent,
      notifyUrl,
      returnUrl,
      config,
    })

    return json(res, 200, {
      provider: 'alipay',
      outTradeNo,
      amountFen,
      channel,
      payUrl: buildGatewayUrl(params, config),
    })
  } catch (error) {
    console.error('alipay_create_failed', error)
    return json(res, error.statusCode || 500, {
      error: error.message || 'Failed to create Alipay order',
      detail: error.responseBody || null,
    })
  }
}
