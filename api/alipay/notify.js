const {
  buildOrderSnapshot,
  forwardPaidOrder,
  getAlipayConfig,
  parseFormEncoded,
  readRawBody,
  verifyAlipaySignature,
} = require('../_lib/alipay')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('failure')
  }

  try {
    const config = getAlipayConfig()
    const rawBody = await readRawBody(req)
    const params = parseFormEncoded(rawBody)

    if (!verifyAlipaySignature(params, config.publicKey)) {
      return res.status(401).send('failure')
    }

    if (config.appId && params.app_id && params.app_id !== config.appId) {
      return res.status(400).send('failure')
    }

    if (config.sellerId && params.seller_id && params.seller_id !== config.sellerId) {
      return res.status(400).send('failure')
    }

    const snapshot = buildOrderSnapshot(params)
    console.info('alipay_notify_success', snapshot)

    if (snapshot.tradeState === 'TRADE_SUCCESS' || snapshot.tradeState === 'TRADE_FINISHED') {
      await forwardPaidOrder(config, snapshot)
    }

    return res.status(200).send('success')
  } catch (error) {
    console.error('alipay_notify_failed', error)
    return res.status(500).send('failure')
  }
}
