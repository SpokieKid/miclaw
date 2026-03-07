/**
 * [INPUT]: Depends on react, i18n/context, shadcn dialog/input
 * [OUTPUT]: Exports payment dialog with live WeChat + Alipay order flows
 * [POS]: Payment UI layer for the landing page CTA
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { useLocale } from '@/i18n/context'
import type { TranslationKey } from '@/i18n/translations'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export type PaymentProvider = 'wechat' | 'alipay'

type PaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: PaymentProvider
  onProviderChange: (provider: PaymentProvider) => void
}

type PaymentOrder = {
  provider: PaymentProvider
  outTradeNo: string
  amountFen: number
  channel: string
  codeUrl?: string | null
  h5Url?: string | null
  payUrl?: string | null
}

type OrderStatusResponse = {
  provider: PaymentProvider
  outTradeNo: string
  transactionId: string | null
  tradeState: string
  tradeStateDesc: string
  successTime: string | null
  amountFen: number | null
  payer: Record<string, unknown> | null
  attach: { contact?: string } | null
}

const ORDER_STORAGE_PREFIX = 'miclaw-last-order'

function detectMobile() {
  if (typeof window === 'undefined') return false
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent)
}

function detectWechatBrowser() {
  if (typeof window === 'undefined') return false
  return /MicroMessenger/i.test(window.navigator.userAgent)
}

function getOrderStorageKey(provider: PaymentProvider) {
  return `${ORDER_STORAGE_PREFIX}:${provider}`
}

function formatAmount(amountFen: number | null) {
  if (amountFen == null) return '--'
  return `¥${(amountFen / 100).toFixed(2)}`
}

function getTradeStateLabel(provider: PaymentProvider, tradeState: string, t: (key: TranslationKey) => string) {
  const wechatMap: Record<string, string> = {
    NOTPAY: t('pay.status.notpay'),
    USERPAYING: t('pay.status.userpaying'),
    SUCCESS: t('pay.status.success'),
    CLOSED: t('pay.status.closed'),
    PAYERROR: t('pay.status.failed'),
    REFUND: t('pay.status.refund'),
  }
  const alipayMap: Record<string, string> = {
    WAIT_BUYER_PAY: t('pay.status.waitBuyerPay'),
    TRADE_SUCCESS: t('pay.status.tradeSuccess'),
    TRADE_FINISHED: t('pay.status.tradeFinished'),
    TRADE_CLOSED: t('pay.status.tradeClosed'),
  }
  const map = provider === 'wechat' ? wechatMap : alipayMap

  return map[tradeState] || tradeState
}

function getCreateButtonLabel(provider: PaymentProvider, t: (key: TranslationKey) => string) {
  return provider === 'wechat' ? t('pay.createWechat') : t('pay.createAlipay')
}

function getProviderDescription(provider: PaymentProvider, t: (key: TranslationKey) => string) {
  return provider === 'wechat' ? t('pay.wechatDesc') : t('pay.alipayDesc')
}

function getPendingHint(provider: PaymentProvider, isMobile: boolean, t: (key: TranslationKey) => string) {
  if (provider === 'wechat') {
    return isMobile ? t('pay.wechatMobileHint') : t('pay.wechatDesktopHint')
  }

  return isMobile ? t('pay.alipayMobileHint') : t('pay.alipayDesktopHint')
}

function getStatusEndpoint(provider: PaymentProvider) {
  return provider === 'wechat' ? '/api/pay/status' : '/api/alipay/status'
}

export function PaymentDialog({
  open,
  onOpenChange,
  provider,
  onProviderChange,
}: PaymentDialogProps) {
  const { t } = useLocale()
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<PaymentOrder | null>(null)
  const [status, setStatus] = useState<OrderStatusResponse | null>(null)
  const isMobile = useMemo(detectMobile, [])
  const isWechatBrowser = useMemo(detectWechatBrowser, [])

  useEffect(() => {
    if (!open || typeof window === 'undefined') return

    setError('')
    setOrder(null)
    setStatus(null)

    const raw = window.localStorage.getItem(getOrderStorageKey(provider))
    if (!raw) return

    try {
      const saved = JSON.parse(raw) as PaymentOrder
      setOrder(saved)
      if (saved.outTradeNo) {
        setStatus({
          provider: saved.provider,
          outTradeNo: saved.outTradeNo,
          transactionId: null,
          tradeState: saved.provider === 'wechat' ? 'NOTPAY' : 'WAIT_BUYER_PAY',
          tradeStateDesc: '',
          successTime: null,
          amountFen: saved.amountFen,
          payer: null,
          attach: null,
        })
      }
    } catch {
      window.localStorage.removeItem(getOrderStorageKey(provider))
    }
  }, [open, provider])

  const pollStatus = useEffectEvent(async (currentProvider: PaymentProvider, outTradeNo: string) => {
    try {
      const response = await fetch(`${getStatusEndpoint(currentProvider)}?outTradeNo=${encodeURIComponent(outTradeNo)}`)
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || t('pay.errorGeneric'))
      }

      setStatus(payload)
      if (
        payload.tradeState === 'SUCCESS' ||
        payload.tradeState === 'CLOSED' ||
        payload.tradeState === 'PAYERROR' ||
        payload.tradeState === 'REFUND' ||
        payload.tradeState === 'TRADE_SUCCESS' ||
        payload.tradeState === 'TRADE_FINISHED' ||
        payload.tradeState === 'TRADE_CLOSED'
      ) {
        window.localStorage.removeItem(getOrderStorageKey(currentProvider))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('pay.errorGeneric'))
    }
  })

  useEffect(() => {
    if (!open || !order?.outTradeNo) return

    pollStatus(order.provider, order.outTradeNo)
    const timer = window.setInterval(() => {
      pollStatus(order.provider, order.outTradeNo)
    }, 3000)

    return () => {
      window.clearInterval(timer)
    }
  }, [open, order?.outTradeNo, order?.provider, pollStatus])

  async function createOrder() {
    const normalizedContact = contact.trim()
    if (!normalizedContact) {
      setError(t('pay.contactHint'))
      return
    }

    if (provider === 'wechat' && isMobile && isWechatBrowser) {
      setError(t('pay.wechatBrowserHint'))
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const route = provider === 'wechat' ? '/api/pay/create' : '/api/alipay/create'
      const channel = provider === 'wechat'
        ? (isMobile ? 'mweb' : 'native')
        : (isMobile ? 'wap' : 'page')

      const response = await fetch(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: normalizedContact,
          channel,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || t('pay.errorGeneric'))
      }

      setOrder(payload)
      setStatus({
        provider: payload.provider,
        outTradeNo: payload.outTradeNo,
        transactionId: null,
        tradeState: payload.provider === 'wechat' ? 'NOTPAY' : 'WAIT_BUYER_PAY',
        tradeStateDesc: '',
        successTime: null,
        amountFen: payload.amountFen,
        payer: null,
        attach: { contact: normalizedContact },
      })
      window.localStorage.setItem(getOrderStorageKey(payload.provider), JSON.stringify(payload))

      if (payload.provider === 'wechat' && payload.channel === 'mweb' && payload.h5Url) {
        const redirectUrl = `${window.location.origin}${window.location.pathname}?pay_result=wechat`
        const target = `${payload.h5Url}&redirect_url=${encodeURIComponent(redirectUrl)}`
        window.location.assign(target)
        return
      }

      if (payload.provider === 'alipay' && payload.payUrl) {
        window.location.assign(payload.payUrl)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('pay.errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  function resetOrder() {
    setOrder(null)
    setStatus(null)
    setError('')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(getOrderStorageKey(provider))
    }
  }

  function reopenAlipay() {
    if (order?.provider === 'alipay' && order.payUrl) {
      window.location.assign(order.payUrl)
    }
  }

  const tradeState = status?.tradeState || (provider === 'wechat' ? 'NOTPAY' : 'WAIT_BUYER_PAY')
  const isSuccess = tradeState === 'SUCCESS' || tradeState === 'TRADE_SUCCESS' || tradeState === 'TRADE_FINISHED'
  const qrSrc = order?.provider === 'wechat' && order.codeUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=480x480&data=${encodeURIComponent(order.codeUrl)}`
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] border-[var(--warm-light)] bg-[var(--card)] p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-[1.2rem] text-[var(--bark)]">
            {t('pay.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="block text-[0.9rem] font-medium text-[var(--bark)]">
              {t('pay.methodLabel')}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onProviderChange('wechat')}
                className={`rounded-xl border px-3 py-2 text-[0.88rem] font-medium transition-colors ${
                  provider === 'wechat'
                    ? 'border-[var(--bark)] bg-[var(--bark)] text-[var(--cream)]'
                    : 'border-[var(--warm-light)] bg-white text-[var(--bark)] hover:bg-[var(--cream-dark)]'
                }`}
              >
                {t('pay.methodWechat')}
              </button>
              <button
                type="button"
                onClick={() => onProviderChange('alipay')}
                className={`rounded-xl border px-3 py-2 text-[0.88rem] font-medium transition-colors ${
                  provider === 'alipay'
                    ? 'border-[var(--bark)] bg-[var(--bark)] text-[var(--cream)]'
                    : 'border-[var(--warm-light)] bg-white text-[var(--bark)] hover:bg-[var(--cream-dark)]'
                }`}
              >
                {t('pay.methodAlipay')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[0.9rem] font-medium text-[var(--bark)]">
              {t('pay.contactLabel')}
            </label>
            <Input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder={t('pay.contactPlaceholder')}
              className="border-[var(--warm-light)] bg-white text-[var(--bark)]"
            />
            <p className="text-[0.82rem] leading-relaxed text-[var(--bark-light)]">
              {t('pay.desc')}
            </p>
            <p className="text-[0.82rem] leading-relaxed text-[var(--bark-light)]">
              {getProviderDescription(provider, t)}
            </p>
          </div>

          {order && order.provider === provider ? (
            <div className="space-y-4 rounded-2xl border border-[var(--warm-light)] bg-white/70 p-4">
              <div className="grid gap-2 text-[0.9rem] text-[var(--bark)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--bark-light)]">{t('pay.orderLabel')}</span>
                  <span className="font-mono text-[0.78rem]">{status?.outTradeNo || order.outTradeNo}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--bark-light)]">{t('pay.amountLabel')}</span>
                  <span className="font-semibold">{formatAmount(status?.amountFen ?? order.amountFen)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--bark-light)]">{t('pay.statusLabel')}</span>
                  <span className={isSuccess ? 'font-semibold text-emerald-700' : 'font-semibold'}>
                    {getTradeStateLabel(provider, tradeState, t)}
                  </span>
                </div>
              </div>

              {provider === 'wechat' && !isMobile && qrSrc && !isSuccess && (
                <div className="space-y-2">
                  <img
                    src={qrSrc}
                    alt="EinClaw 微信支付二维码"
                    className="mx-auto w-full max-w-[240px] rounded-xl border border-[var(--warm-light)]"
                  />
                  <p className="text-center text-[0.84rem] leading-relaxed text-[var(--bark-light)]">
                    {getPendingHint(provider, isMobile, t)}
                  </p>
                </div>
              )}

              {provider === 'wechat' && isMobile && !isSuccess && (
                <p className="text-[0.84rem] leading-relaxed text-[var(--bark-light)]">
                  {getPendingHint(provider, isMobile, t)}
                </p>
              )}

              {provider === 'alipay' && !isSuccess && (
                <div className="space-y-3">
                  <p className="text-[0.84rem] leading-relaxed text-[var(--bark-light)]">
                    {getPendingHint(provider, isMobile, t)}
                  </p>
                  <button
                    type="button"
                    onClick={reopenAlipay}
                    className="w-full rounded-full bg-[#1677ff] px-5 py-3 text-[0.88rem] font-medium text-white transition-colors hover:bg-[#0f66dc]"
                  >
                    {t('pay.openAlipay')}
                  </button>
                </div>
              )}

              {isSuccess && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-[0.88rem] leading-relaxed text-emerald-800">
                  {t('pay.successHint')}
                </p>
              )}

              <button
                type="button"
                onClick={resetOrder}
                className="w-full rounded-full border border-[var(--warm-light)] px-4 py-2 text-[0.88rem] font-medium text-[var(--bark)] transition-colors hover:bg-[var(--cream-dark)]"
              >
                {t('pay.retry')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={createOrder}
              disabled={submitting}
              className="w-full rounded-full bg-[var(--bark)] px-5 py-3 text-[0.88rem] font-medium text-[var(--cream)] transition-all hover:bg-[#2d2924] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t('pay.creating') : getCreateButtonLabel(provider, t)}
            </button>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-[0.85rem] leading-relaxed text-red-700">
              {error}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
