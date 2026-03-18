/**
 * [INPUT]: Depends on framer-motion, lucide-react, react, i18n/context
 * [OUTPUT]: Exports Home landing page with Hero + Problem sections
 * [POS]: Main landing page of web app, rendered by App.tsx route
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Server, Sparkles, GitBranch, BookOpen, ExternalLink, ChevronDown, Mail } from 'lucide-react'
import { SiX, SiXiaohongshu } from 'react-icons/si'
import { Link } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useLocale } from '@/i18n/context'
import { PaymentDialog, type PaymentProvider } from '@/components/payment/PaymentDialog'

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: EASE as unknown as [number, number, number, number] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ================================================================
   NAV
   ================================================================ */

function Nav({ onOpenPayment }: { onOpenPayment: () => void }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)] px-6 py-5 md:px-10"
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl tracking-tight text-[var(--bark)]">
          EinClaw
        </Link>

        {/* Center: nav links — absolute so position is independent of siblings */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6">
          <Link
            to="/about"
            className="text-[0.85rem] text-[var(--bark-light)] transition-colors hover:text-[var(--bark)]"
          >
            {t('nav.about')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-[0.85rem] text-[var(--bark-light)] transition-colors hover:text-[var(--bark)] outline-none">
              {t('nav.products')}
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[200px]">
              <DropdownMenuItem asChild>
                <a href="https://einko.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
                  Einko App
                  <ExternalLink className="h-3 w-3 text-[var(--bark-light)]" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://mineclaw.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
                  EinClaw
                  <ExternalLink className="h-3 w-3 text-[var(--bark-light)]" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center justify-between opacity-60">
                EinClaw Park
                <span className="text-[0.7rem] text-[var(--bark-light)]">Coming Soon</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: locale toggle + CTA */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-0.5 text-[0.82rem]">
            <button
              onClick={() => setLocale('zh')}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                locale === 'zh'
                  ? 'font-medium text-[var(--bark)]'
                  : 'text-[var(--warm-light)] hover:text-[var(--bark-light)]'
              }`}
            >
              中
            </button>
            <span className="text-[var(--warm-light)]">/</span>
            <button
              onClick={() => setLocale('en')}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                locale === 'en'
                  ? 'font-medium text-[var(--bark)]'
                  : 'text-[var(--warm-light)] hover:text-[var(--bark-light)]'
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenPayment}
            className="rounded-full bg-[var(--bark)] px-5 py-2.5 text-[0.82rem] font-medium text-[var(--cream)] transition-all hover:bg-[#2d2924] hover:shadow-lg"
          >
            {t('nav.cta')}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

/* ================================================================
   HERO
   ================================================================ */

function Hero({ onOpenPayment }: { onOpenPayment: () => void }) {
  const { t } = useLocale()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden py-24 md:py-28"
    >
      {/* Subtle warm radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 70% 45%, rgba(232,99,74,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-8 md:px-10">
        {/* Left: Copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-block rounded-md bg-[var(--cream-dark)] px-4 py-1.5 text-[0.8rem] font-medium text-[var(--bark)]">
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-8 font-serif text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight text-[var(--bark)]"
          >
            <span className="italic text-[var(--terracotta)]">{t('hero.titleAccent1')}</span>
            <br />
            {t('hero.titleMid')}
            <span className="italic text-[var(--terracotta)]">{t('hero.titleAccent2')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[var(--bark-light)]"
          >
            {t('hero.subtitle')}
            <br />
            {t('hero.subtitleLine2')}
            {t('hero.subtitleCaption') && (
              <span className="mt-1 block text-[0.85rem] tracking-wide uppercase text-[var(--warm)]">
                {t('hero.subtitleCaption')}
              </span>
            )}
          </motion.p>

          {/* Price */}
          <motion.div variants={fadeUp} custom={3} className="mt-10">
            <button
              type="button"
              onClick={onOpenPayment}
              className="inline-flex items-center gap-3 rounded-full bg-[var(--bark)] px-7 py-3.5 font-mono text-[0.85rem] font-bold tracking-wider uppercase text-[var(--cream)] transition-all hover:bg-[#2d2924] hover:shadow-xl"
            >
              {t('hero.priceCta')}
              {t('hero.priceOld') && <span className="text-[var(--warm)] line-through">{t('hero.priceOld')}</span>}
            </button>

            <p className="mt-4 text-[0.9rem] text-[var(--bark-light)]">
              {t('hero.priceAvail')}
            </p>
          </motion.div>

        </motion.div>

        {/* Right: Product image */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: imageY, scale: imageScale }}
          className="relative flex items-center justify-center md:justify-end"
        >
          {/* Warm glow behind product */}
          <div
            className="absolute top-1/2 left-1/2 h-[90%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(232,99,74,0.12) 0%, rgba(245,200,160,0.08) 50%, transparent 80%)',
            }}
          />
          <img
            src="/product-white.png"
            alt="EinClaw Mic device"
            className="relative z-10 w-full max-w-[420px] drop-shadow-2xl md:max-w-[480px]"
          />
        </motion.div>
      </div>

    </section>
  )
}

/* ================================================================
   DEMO VIDEO
   ================================================================ */

const VIDEO_URL = 'https://storage.googleapis.com/random-public-affe/miclaw/miclaw_final.mov'

function Demo() {
  const { t } = useLocale()

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        {/* Left: Video */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <video
            src={VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className="max-w-[320px] rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Right: Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="md:pl-16 lg:pl-24 md:text-right"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.15] tracking-tight text-[var(--bark)]"
          >
            {t('demo.title')}
            <br />
            {t('demo.titleLine2')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[var(--bark-light)]"
          >
            {t('demo.subtitle')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================
   BATTERY
   ================================================================ */

function Battery() {
  const { t } = useLocale()

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        {/* Left: Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.15] tracking-tight text-[var(--bark)]"
          >
            {t('battery.title')}
            <br />
            {t('battery.titleLine2')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[var(--bark-light)]"
          >
            {t('battery.subtitle')}
          </motion.p>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="flex justify-center md:justify-end"
        >
          <img
            src="/hero.png"
            alt="EinClaw hero image"
            className="max-w-[320px] drop-shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================
   USE CASES
   ================================================================ */

const CASE_ICONS = [Sparkles, GitBranch, BookOpen] as const
const CASE_KEYS = ['card1', 'card2', 'card3'] as const

function UseCases() {
  const { t } = useLocale()

  return (
    <section className="relative py-28 md:py-36">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        {/* Left: Stacked cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="flex flex-col gap-4"
        >
          {CASE_KEYS.map((key, i) => {
            const Icon = CASE_ICONS[i]
            return (
              <motion.div
                key={key}
                variants={fadeUp}
                custom={i}
                className="group flex items-start gap-5 rounded-xl border border-[var(--warm-light)] bg-[var(--card)] px-6 py-5 transition-all duration-300 hover:border-[var(--warm)] hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cream-dark)] text-[var(--terracotta)] transition-colors group-hover:bg-[var(--terracotta)] group-hover:text-white">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[0.95rem] font-semibold leading-snug text-[var(--bark)]">
                    {t(`cases.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--bark-light)]">
                    {t(`cases.${key}.desc`)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Right: Title */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="max-w-md font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.15] tracking-tight text-[var(--bark)] md:text-right md:ml-auto"
        >
          {t('cases.title')}
          <br />
          {t('cases.titleLine2')}
          <br />
          <span className="text-[var(--terracotta)]">{t('cases.titleAccent')}</span>
        </motion.h2>
      </div>
    </section>
  )
}

/* ================================================================
   PROBLEM
   ================================================================ */

function Problem() {
  const { t } = useLocale()
  const problemTitleLine2 = t('problem.titleLine2')
  const problemTitleAccent = t('problem.titleAccent')

  return (
    <section id="problem" className="relative py-28 md:py-36">
      {/* Subtle section divider gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 50%, var(--cream) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        {/* Left: Title */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="max-w-md font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.15] tracking-tight text-[var(--bark)]"
        >
          {t('problem.title')}
          {problemTitleLine2 ? (
            <>
              <br />
              {problemTitleLine2}
            </>
          ) : null}
          {problemTitleAccent ? (
            <>
              <br />
              <span className="text-[var(--terracotta)]">{problemTitleAccent}</span>
            </>
          ) : null}
        </motion.h2>

        {/* Right: Single service card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={1}
        >
          <div className="rounded-2xl border border-[var(--warm-light)] bg-[var(--card)] p-7 shadow-sm md:p-9">
            <span className="inline-block rounded-full bg-[var(--cream-dark)] px-3 py-1 text-[0.75rem] font-medium tracking-wider uppercase text-[var(--bark-light)]">
              {t('problem.service.badge')}
            </span>

            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cream-dark)] text-[var(--terracotta)]">
                <Server className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <div>
                <h3 className="text-[1.2rem] font-semibold leading-tight text-[var(--bark)]">
                  {t('problem.service.title')}
                </h3>
                <p className="mt-2 text-[0.96rem] leading-relaxed text-[var(--bark-light)]">
                  {t('problem.service.desc')}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <p className="rounded-lg bg-[var(--cream)] px-3 py-2 text-[0.87rem] text-[var(--bark)]">
                {t('problem.service.point1')}
              </p>
              <p className="rounded-lg bg-[var(--cream)] px-3 py-2 text-[0.87rem] text-[var(--bark)]">
                {t('problem.service.point2')}
              </p>
              <p className="rounded-lg bg-[var(--cream)] px-3 py-2 text-[0.87rem] text-[var(--bark)]">
                {t('problem.service.point3')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================
   FOOTER
   ================================================================ */

function Footer() {
  const { locale, t } = useLocale()

  return (
    <footer className="border-t border-[var(--warm-light)] bg-[var(--cream)] py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4 md:px-10">
        {/* Brand */}
        <div>
          <Link to="/" className="font-serif text-xl tracking-tight text-[var(--bark)]">
            EinClaw
          </Link>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-[0.8rem] font-medium tracking-wider uppercase text-[var(--bark)]">
            {t('footer.products')}
          </h4>
          <ul className="mt-4 space-y-2.5 text-[0.85rem] text-[var(--bark-light)]">
            <li>
              <a href="https://einko.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--bark)]">
                Einko App <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li><Link to="/" className="transition-colors hover:text-[var(--bark)]">EinClaw Mic</Link></li>
            <li>
              <a href="https://mineclaw.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--bark)]">
                EinClaw <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li className="opacity-50">EinClaw Park <span className="text-[0.75rem]">· Coming Soon</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[0.8rem] font-medium tracking-wider uppercase text-[var(--bark)]">
            {t('footer.contact')}
          </h4>
          <ul className="mt-4 space-y-2.5 text-[0.85rem] text-[var(--bark-light)]">
            <li>
              <a href="mailto:affeisme@gmail.com" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--bark)]">
                <Mail className="h-3.5 w-3.5" /> affeisme@gmail.com
              </a>
            </li>
            <li>
              <a href="mailto:arvinchen98@outlook.com" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--bark)]">
                <Mail className="h-3.5 w-3.5" /> arvinchen98@outlook.com
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-[0.8rem] font-medium tracking-wider uppercase text-[var(--bark)]">
            {t('footer.social')}
          </h4>
          <ul className="mt-4 space-y-2.5 text-[0.85rem] text-[var(--bark-light)]">
            <li>
              <a href={locale === 'zh' ? 'https://x.com/affe_is_me' : 'https://x.com/affe_z'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--bark)]">
                <SiX className="h-3.5 w-3.5" /> {locale === 'zh' ? '@affe_is_me' : '@affe_z'}
              </a>
            </li>
            {locale === 'zh' && (
              <li>
                <a href="https://www.xiaohongshu.com/user/profile/Gnahzeffa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--bark)]">
                  <SiXiaohongshu className="h-3.5 w-3.5" /> Gnahzeffa
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-[var(--warm-light)] px-6 pt-6 md:px-10">
        <p className="text-[0.8rem] text-[var(--bark-light)]">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}

/* ================================================================
   HOME PAGE
   ================================================================ */

export default function Home() {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('wechat')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const payResult = params.get('pay_result')
    if (payResult === 'wechat' || payResult === 'alipay') {
      setPaymentProvider(payResult)
      setPaymentOpen(true)
      params.delete('pay_result')
      const nextQuery = params.toString()
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`
      window.history.replaceState({}, '', nextUrl)
    }
  }, [])

  return (
    <>
      <Nav onOpenPayment={() => setPaymentOpen(true)} />
      <Hero onOpenPayment={() => setPaymentOpen(true)} />
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        provider={paymentProvider}
        onProviderChange={setPaymentProvider}
      />
      <Demo />
      <Battery />
      <UseCases />
      <Problem />
      <Footer />
    </>
  )
}
