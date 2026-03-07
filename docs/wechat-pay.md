# EinClaw Payment Integration

## What this implementation does

- Creates real merchant orders instead of showing a static collection QR.
- Requires the buyer to enter a contact identifier before payment so each payment is traceable.
- Supports WeChat desktop `Native` payment and mobile `H5(MWEB)` payment.
- Supports Alipay desktop website payment and mobile website payment.
- Verifies and decrypts WeChat payment callbacks.
- Verifies Alipay callback signatures.
- Exposes a status API for frontend polling and an optional webhook forwarder for your own backend/automation.

## Files

- `api/pay/create.js`: create WeChat payment orders
- `api/pay/status.js`: query order status from WeChat
- `api/pay/notify.js`: WeChat callback endpoint
- `api/_lib/wechatpay.js`: signing, verification, decrypt helpers
- `api/alipay/create.js`: create Alipay payment redirects
- `api/alipay/status.js`: query order status from Alipay
- `api/alipay/notify.js`: Alipay callback endpoint
- `api/_lib/alipay.js`: signing, verification, gateway helpers

## Official docs

- Alipay website payment doc family: `https://opendocs.alipay.com/open/270/105899`

## WeChat env vars

- `WECHAT_PAY_MCH_ID`: 微信支付商户号
- `WECHAT_PAY_APP_ID`: 对应支付产品的 AppID
- `WECHAT_PAY_SERIAL_NO`: 商户 API 证书序列号
- `WECHAT_PAY_PRIVATE_KEY`: 商户 API 私钥 PEM
- `WECHAT_PAY_API_V3_KEY`: APIv3 密钥，固定 32 位
- `WECHAT_PAY_PLATFORM_PUBLIC_KEY`: 微信支付平台公钥 PEM
- `WECHAT_PAY_NOTIFY_URL`: 线上支付回调地址

## Alipay env vars

- `ALIPAY_APP_ID`: 支付宝开放平台应用 `app_id`
- `ALIPAY_APP_PRIVATE_KEY`: 应用私钥 PEM
- `ALIPAY_PUBLIC_KEY`: 支付宝公钥 PEM
- `ALIPAY_NOTIFY_URL`: 支付宝异步回调地址
- `ALIPAY_RETURN_URL`: 支付成功后的同步跳回地址
- `ALIPAY_SELLER_ID`: 可选，用于校验回调中的 `seller_id`
- `ALIPAY_GATEWAY`: 可选，默认 `https://openapi.alipay.com/gateway.do`

## Important product notes

- Desktop QR flow uses `Native` payment.
- Mobile browser flow uses `H5(MWEB)` payment.
- If you need in-WeChat-browser checkout, you still need a `JSAPI` flow with `openid`. That is not included in this first pass.
- The current desktop QR image is rendered through `api.qrserver.com` from WeChat's `code_url` so the frontend can work without adding a new package in this environment. Replace that with a local QR generator before long-term production use.
- Alipay in this implementation uses `alipay.trade.page.pay` for desktop and `alipay.trade.wap.pay` for mobile, then queries with `alipay.trade.query`.
- This Alipay implementation uses key mode, not certificate mode.

## Suggested next step

- Add a real order store or webhook consumer so successful payments are persisted outside Vercel logs.
- Replace the temporary third-party QR rendering step for WeChat with a local QR generator.
