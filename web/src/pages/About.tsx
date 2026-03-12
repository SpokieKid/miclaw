/**
 * [INPUT]: Depends on framer-motion, lucide-react, react-router, i18n/context
 * [OUTPUT]: Exports About page component
 * [POS]: Company intro page of web app, rendered by App.tsx route /about
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Mic, Image, Cloud, Globe, ChevronDown } from 'lucide-react'
import { Link } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useLocale } from '@/i18n/context'

/* ================================================================
   ANIMATION
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
   ABOUT PAGE
   ================================================================ */

export default function About() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE as unknown as [number, number, number, number] }}
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
              className="text-[0.85rem] font-medium text-[var(--bark)] border-b border-[var(--bark)]"
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
                <DropdownMenuItem disabled className="flex items-center justify-between opacity-60">
                  EinClaw
                  <span className="text-[0.7rem] text-[var(--bark-light)]">Coming Soon</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="flex items-center justify-between opacity-60">
                  EinClaw Park
                  <span className="text-[0.7rem] text-[var(--bark-light)]">Coming Soon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: locale toggle */}
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
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="flex min-h-[60vh] items-center pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl">
            <motion.div variants={fadeUp} custom={0}>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[0.85rem] text-[var(--bark-light)] transition-colors hover:text-[var(--bark)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                EinClaw
              </Link>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-8 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.1] tracking-tight text-[var(--bark)]"
            >
              {t('about.heroTitle')}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-lg text-[1.1rem] leading-relaxed text-[var(--bark-light)]"
            >
              {t('about.heroSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.15] tracking-tight text-[var(--bark)]"
            >
              {t('about.missionTitle')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-[1.05rem] leading-[1.8] text-[var(--bark-light)]"
            >
              {t('about.missionDesc')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, var(--cream-dark) 0%, var(--cream) 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {(
              [
                { key: 'product1', icon: Mic, link: null },
                { key: 'product2', icon: Image, link: 'https://einko.app' },
                { key: 'product3', icon: Cloud, link: null },
                { key: 'product4', icon: Globe, link: null },
              ] as const
            ).map(({ key, icon: Icon, link }, i) => (
              <motion.div
                key={key}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-[var(--warm-light)] bg-[var(--card)] p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--cream-dark)] text-[var(--terracotta)]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  {t(`about.${key}.status` as any) && (
                    <span className="rounded-full bg-[var(--cream-dark)] px-3 py-1 text-[0.75rem] font-medium tracking-wider uppercase text-[var(--bark-light)]">
                      {t(`about.${key}.status` as any)}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-serif text-[1.5rem] text-[var(--bark)]">
                  {t(`about.${key}.name` as any)}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--bark-light)]">
                  {t(`about.${key}.desc` as any)}
                </p>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--terracotta)] transition-colors hover:text-[var(--bark)]"
                  >
                    {link.replace('https://', '')} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-xl"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.15] tracking-tight text-[var(--bark)]"
            >
              {t('about.contactTitle')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-5 text-[1.05rem] leading-relaxed text-[var(--bark-light)]"
            >
              {t('about.contactDesc')}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
