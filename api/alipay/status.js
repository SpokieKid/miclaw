const {
  alipayOpenApiRequest,
  buildOrderSnapshot,
  getAlipayConfig,
} = require('../_lib/alipay')

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
    const config = getAlipayConfig()
    const data = await alipayOpenApiRequest({
      method: 'alipay.trade.query',
      bizContent: {
        out_trade_no: outTradeNo,
      },
      config,
    })
    const response = data.alipay_trade_query_response

    if (!response) {
      throw new Error('Missing Alipay query response')
    }

    if (response.code !== '10000' && response.code !== '40004') {
      const error = new Error(response.sub_msg || response.msg || 'Failed to query Alipay order')
      error.responseBody = response
      throw error
    }

    return json(res, 200, buildOrderSnapshot(response))
  } catch (error) {
    console.error('alipay_status_failed', error)
    return json(res, error.statusCode || 500, {
      error: error.message || 'Failed to query Alipay order',
      detail: error.responseBody || null,
    })
  }
}
