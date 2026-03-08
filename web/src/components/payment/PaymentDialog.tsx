/**
 * [INPUT]: Depends on react, i18n/context, shadcn dialog
 * [OUTPUT]: Exports payment dialog showing WeChat QR code
 * [POS]: Payment UI layer for the landing page CTA
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { useLocale } from '@/i18n/context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export type PaymentProvider = 'wechat' | 'alipay'

type PaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider?: PaymentProvider
  onProviderChange?: (provider: PaymentProvider) => void
}

export function PaymentDialog({
  open,
  onOpenChange,
}: PaymentDialogProps) {
  const { t } = useLocale()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] border-[var(--warm-light)] bg-[var(--card)] p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-[1.2rem] text-[var(--bark)]">
            {t('pay.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <img
            src="/wechatpay.jpg"
            alt="微信支付二维码"
            className="mx-auto w-full max-w-[320px] rounded-xl"
          />
          <p className="text-center text-[0.88rem] leading-relaxed text-[var(--bark-light)]">
            长按或扫码，微信支付
          </p>
          <p className="text-center text-[0.9rem] font-medium text-[var(--terracotta)]">
            付款时请备注你的微信号
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
