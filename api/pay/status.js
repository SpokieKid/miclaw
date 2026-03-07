const {
  buildOrderSnapshot,
  getWechatConfig,
  wechatRequest,
} = require('../_lib/wechatpay')

function json(res, status, payload) {
  res.status(status).json(payload)
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const outTradeNo = typeof req.query.outTradeNo === 'string' ? req.query.outTradeNo.trim() : ''
  if (!outTradeNo) {
    return json(res, 400, { error: 'outTradeNo is required' })
  }

  try {
    const config = getWechatConfig()
    const canonicalUrl = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(outTradeNo)}?mchid=${encodeURIComponent(config.mchId)}`
    const result = await wechatRequest({
      method: 'GET',
      canonicalUrl,
      config,
    })

    return json(res, 200, buildOrderSnapshot(result))
  } catch (error) {
    console.error('wechat_pay_status_failed', error)
    return json(res, error.statusCode || 500, {
      error: error.message || 'Failed to query WeChat Pay order',
      detail: error.responseBody || null,
    })
  }
}
