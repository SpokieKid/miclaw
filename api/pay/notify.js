const {
  buildOrderSnapshot,
  decryptWechatResource,
  forwardPaidOrder,
  getWechatConfig,
  readRawBody,
  verifyWechatSignature,
} = require('../_lib/wechatpay')

function reply(res, status, payload) {
  res.status(status).json(payload)
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return reply(res, 405, { code: 'ERROR', message: 'Method not allowed' })
  }

  try {
    const config = getWechatConfig()
    const rawBody = await readRawBody(req)
    const signature = req.headers['wechatpay-signature']
    const timestamp = req.headers['wechatpay-timestamp']
    const nonce = req.headers['wechatpay-nonce']
    const valid = verifyWechatSignature({
      timestamp,
      nonce,
      signature,
      body: rawBody,
      platformPublicKey: config.platformPublicKey,
    })

    if (!valid) {
      return reply(res, 401, { code: 'ERROR', message: 'Invalid signature' })
    }

    const payload = JSON.parse(rawBody)
    const transaction = decryptWechatResource(payload.resource, config.apiV3Key)
    const snapshot = buildOrderSnapshot(transaction)

    console.info('wechat_pay_notify_success', snapshot)
    await forwardPaidOrder(config, snapshot)

    return reply(res, 200, { code: 'SUCCESS', message: '成功' })
  } catch (error) {
    console.error('wechat_pay_notify_failed', error)
    return reply(res, 500, { code: 'ERROR', message: 'Internal error' })
  }
}
