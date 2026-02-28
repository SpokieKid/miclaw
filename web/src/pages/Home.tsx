/**
 * [INPUT]: Depends on framer-motion, lucide-react, react
 * [OUTPUT]: Exports Home landing page with Hero + Problem sections
 * [POS]: Main landing page of web app, rendered by App.tsx route
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Smartphone, Clock, Monitor } from 'lucide-react'

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
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#problem" className="text-[0.85rem] text-[var(--bark-light)] transition-colors hover:text-[var(--bark)]">
            痛点
          </a>
          <a href="#solution" className="text-[0.85rem] text-[var(--bark-light)] transition-colors hover:text-[var(--bark)]">
            方案
          </a>
          <a href="#product" className="text-[0.85rem] text-[var(--bark-light)] transition-colors hover:text-[var(--bark)]">
            产品
          </a>
        </div>

        {/* Center logo */}
        <a href="#" className="font-serif text-2xl tracking-tight text-[var(--bark)]">
          MiClaw
        </a>

        {/* Right CTA */}
        <a
          href="#"
          className="rounded-full bg-[var(--bark)] px-5 py-2.5 text-[0.82rem] font-medium text-[var(--cream)] transition-all hover:bg-[#2d2924] hover:shadow-lg"
        >
          Become a Backer
        </a>
      </div>
    </motion.nav>
  )
}

/* ================================================================
   HERO
   ================================================================ */

function Hero() {
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
      className="relative min-h-screen overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
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
              AI Walkie-Talkie
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-8 font-serif text-[clamp(2.8rem,6vw,5.2rem)] leading-[1.05] tracking-tight text-[var(--bark)]"
          >
            Speak, then{' '}
            <span className="italic text-[var(--terracotta)]">forget</span>
            <br />
            about it.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[var(--bark-light)]"
          >
            你和 AI 智能体之间的直线电话。
            <br />
            按下按钮，说出指令，松手走人。
            <span className="mt-1 block text-[0.85rem] tracking-wide uppercase text-[var(--warm)]">
              Your direct line to AI agents
            </span>
          </motion.p>

          {/* Price */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-8 flex items-baseline gap-2"
          >
            <span className="text-3xl font-bold tracking-tight text-[var(--bark)]">¥199</span>
            <span className="text-lg text-[var(--warm)]">/</span>
            <span className="text-3xl font-bold tracking-tight text-[var(--bark)]">$99</span>
            <span className="ml-2 rounded-full border border-[var(--sage)] px-3 py-0.5 text-[0.72rem] font-semibold tracking-wider uppercase text-[var(--sage)]">
              Early Bird
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#"
              className="rounded-full bg-[var(--bark)] px-8 py-3.5 text-[0.9rem] font-medium text-[var(--cream)] transition-all hover:bg-[#2d2924] hover:shadow-xl"
            >
              Become a Backer
            </a>
            <a
              href="#problem"
              className="group flex items-center gap-2.5 rounded-full border border-[var(--warm-light)] px-6 py-3.5 text-[0.9rem] font-medium text-[var(--bark)] transition-all hover:border-[var(--bark)]"
            >
              Learn More
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bark)] text-[var(--cream)] transition-transform group-hover:scale-110">
                <Play className="h-3 w-3 fill-current" />
              </span>
            </a>
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto h-10 w-px bg-gradient-to-b from-[var(--warm)] to-transparent"
        />
      </motion.div>
    </section>
  )
}

/* ================================================================
   PROBLEM
   ================================================================ */

const problems = [
  {
    icon: Smartphone,
    title: '解锁 → 打开 → 等加载 → 打字',
    desc: '想给 AI 下个指令？先掏手机，解锁，打开 App，等加载，然后打字输入。五步才能说出你要做的事。',
  },
  {
    icon: Clock,
    title: '碎片想法，转瞬即逝',
    desc: '开车时想到的事、散步时的灵感、做饭时的念头——"等下记得买牛奶"，5 分钟后就忘了。',
  },
  {
    icon: Monitor,
    title: 'AI 被困在屏幕里',
    desc: '你的 AI 很聪明，但它只在你打开聊天窗口时才知道你在做什么。它缺少一条持续的感知通道。',
  },
]

function Problem() {
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* Section label */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="mb-4"
        >
          <span className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-[var(--warm)]">
            The Problem
          </span>
        </motion.div>

        {/* Section title */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={1}
          className="mb-16 max-w-lg font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.15] tracking-tight text-[var(--bark)] md:mb-20"
        >
          从想法到行动，
          <br />
          <span className="text-[var(--terracotta)]">路径太长了。</span>
        </motion.h2>

        {/* Problem cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="group rounded-2xl border border-[var(--warm-light)] bg-[var(--card)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--warm)] hover:shadow-lg"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cream-dark)] text-[var(--terracotta)] transition-colors group-hover:bg-[var(--terracotta)] group-hover:text-white">
                <p.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-[1.05rem] font-semibold leading-snug text-[var(--bark)]">
                {p.title}
              </h3>
              <p className="text-[0.9rem] leading-relaxed text-[var(--bark-light)]">
                {p.desc}
              </p>
            </motion.div>
          ))}
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
      <Problem />
    </>
  )
}
