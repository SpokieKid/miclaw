/**
 * [INPUT]: Depends on framer-motion, lucide-react, react, i18n/context
 * [OUTPUT]: Exports Home landing page with Hero + Problem sections
 * [POS]: Main landing page of web app, rendered by App.tsx route
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Smartphone, Clock, Monitor, Sparkles, GitBranch, BookOpen } from 'lucide-react'
import { useLocale } from '@/i18n/context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

function Nav() {
  const { locale, setLocale, t } = useLocale()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)] px-6 py-5 md:px-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-serif text-2xl tracking-tight text-[var(--bark)]">
          MiClaw
        </a>

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

          <a
            href="#"
            className="rounded-full bg-[var(--bark)] px-5 py-2.5 text-[0.82rem] font-medium text-[var(--cream)] transition-all hover:bg-[#2d2924] hover:shadow-lg"
          >
            {t('nav.cta')}
          </a>
        </div>
      </div>
    </motion.nav>
  )
}

/* ================================================================
   HERO
   ================================================================ */

function Hero() {
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
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--bark)] px-7 py-3.5 font-mono text-[0.85rem] font-bold tracking-wider uppercase text-[var(--cream)] transition-all hover:bg-[#2d2924] hover:shadow-xl"
                >
                  {t('hero.priceCta')}
                  {t('hero.priceOld') && <span className="text-[var(--warm)] line-through">{t('hero.priceOld')}</span>}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[420px] border-[var(--warm-light)] bg-[var(--card)] p-5">
                <DialogHeader className="text-left">
                  <DialogTitle className="font-serif text-[1.2rem] text-[var(--bark)]">
                    {t('pay.title')}
                  </DialogTitle>
                </DialogHeader>
                <img
                  src="/wechatpay.jpg"
                  alt="微信支付收款码"
                  loading="lazy"
                  className="w-full rounded-xl object-cover"
                />
                <p className="whitespace-pre-line text-[0.94rem] leading-relaxed text-[var(--bark)]">
                  {t('pay.desc')}
                </p>
              </DialogContent>
            </Dialog>

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
            alt="MiClaw device"
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
            alt="MiClaw hero image"
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

const PROBLEM_ICONS = [Smartphone, Clock, Monitor] as const
const PROBLEM_KEYS = ['card1', 'card2', 'card3'] as const

function Problem() {
  const { t } = useLocale()

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
          <br />
          {t('problem.titleLine2')}
          <br />
          <span className="text-[var(--terracotta)]">{t('problem.titleAccent')}</span>
        </motion.h2>

        {/* Right: Stacked cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="flex flex-col gap-4"
        >
          {PROBLEM_KEYS.map((key, i) => {
            const Icon = PROBLEM_ICONS[i]
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
                    {t(`problem.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--bark-light)]">
                    {t(`problem.${key}.desc`)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================
   HOME PAGE
   ================================================================ */

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Demo />
      <Battery />
      <UseCases />
      <Problem />
    </>
  )
}
