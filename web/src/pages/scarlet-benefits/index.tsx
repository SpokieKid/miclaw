/**
 * [INPUT]: Depends on framer-motion, lucide-react, shadcn card/button/avatar, cn utility
 * [OUTPUT]: Exports Scarlet benefits showcase page inspired by the provided reference image
 * [POS]: Standalone route page for a high-fidelity marketing layout recreation
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import type { CSSProperties, ComponentType, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Lightbulb,
  Zap,
  type LucideProps,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const riseIn = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: index * 0.06,
      ease: EASE as unknown as [number, number, number, number],
    },
  }),
}

const dottedBackdrop: CSSProperties = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, var(--scarlet-dot) 1.1px, transparent 0)',
  backgroundSize: '11px 11px',
}

const logoMarks = ['∞∞', 'N', 'LUPP', '◌', 'LOCO', '◒', '∞∞', 'N', 'LUPP']

type IconType = ComponentType<LucideProps>

function SurfaceCard({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <Card
      className={cn(
        'gap-0 rounded-[24px] border-[var(--scarlet-border)] bg-[var(--scarlet-card)] py-0 shadow-none',
        className,
      )}
    >
      {children}
    </Card>
  )
}

function CopyCard({
  title,
  description,
  icon: Icon,
  className,
}: {
  title: string
  description: string
  icon: IconType
  className?: string
}) {
  return (
    <SurfaceCard className={className}>
      <CardContent className="flex h-full items-start justify-between gap-4 px-5 py-5 sm:px-6">
        <div className="space-y-2">
          <h3 className="text-[1.05rem] leading-none font-semibold tracking-[-0.03em] text-[var(--scarlet-text)] sm:text-[1.12rem]">
            {title}
          </h3>
          <p className="max-w-[31ch] text-[0.92rem] leading-6 text-[var(--scarlet-muted)]">
            {description}
          </p>
        </div>
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--scarlet-border)] text-[var(--scarlet-muted)]">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </div>
      </CardContent>
    </SurfaceCard>
  )
}

function PortraitArtwork() {
  return (
    <div
      className="relative min-h-[430px] overflow-hidden rounded-[22px]"
      style={{
        background:
          'radial-gradient(circle at 50% 12%, var(--scarlet-glow), transparent 35%), linear-gradient(180deg, transparent 0%, var(--scarlet-shadow-soft) 100%)',
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[var(--scarlet-shadow-soft)] to-transparent" />
      <svg
        viewBox="0 0 340 470"
        className="absolute inset-x-0 bottom-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="jacketGradient" x1="0%" x2="90%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="var(--scarlet-graphite)" />
            <stop offset="30%" stopColor="var(--scarlet-ink-soft)" />
            <stop offset="70%" stopColor="var(--scarlet-ink)" />
            <stop offset="100%" stopColor="var(--scarlet-graphite)" />
          </linearGradient>
          <linearGradient id="lapelGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="var(--scarlet-silver)" stopOpacity="0.46" />
            <stop offset="100%" stopColor="var(--scarlet-silver)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="headGlow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="var(--scarlet-skin)" />
            <stop offset="100%" stopColor="var(--scarlet-skin-deep)" />
          </radialGradient>
        </defs>

        <ellipse cx="170" cy="452" rx="112" ry="18" fill="var(--scarlet-shadow-soft)" />
        <path
          d="M70 262C82 201 124 168 170 168C216 168 258 201 270 262L292 433C261 448 224 457 170 457C116 457 79 448 48 433L70 262Z"
          fill="url(#jacketGradient)"
        />
        <path
          d="M106 232C117 212 139 200 170 200C201 200 223 212 234 232L227 274C214 284 194 290 170 290C146 290 126 284 113 274L106 232Z"
          fill="var(--scarlet-ink)"
        />
        <path
          d="M106 240C132 256 150 290 156 333L138 429C103 422 80 407 62 382L76 280C81 263 90 249 106 240Z"
          fill="var(--scarlet-ink)"
        />
        <path
          d="M234 240C208 256 190 290 184 333L202 429C237 422 260 407 278 382L264 280C259 263 250 249 234 240Z"
          fill="var(--scarlet-ink-soft)"
        />
        <path d="M115 210L161 257L140 365L101 226Z" fill="url(#lapelGradient)" />
        <path d="M225 210L179 257L200 365L239 226Z" fill="url(#lapelGradient)" />
        <rect x="154" y="182" width="32" height="34" rx="12" fill="var(--scarlet-skin-deep)" />
        <ellipse cx="170" cy="137" rx="43" ry="50" fill="url(#headGlow)" />
        <path
          d="M131 126C136 93 156 75 185 76C211 77 228 96 229 123C214 113 195 109 171 109C151 109 138 114 131 126Z"
          fill="var(--scarlet-ink)"
        />
        <rect x="130" y="136" width="32" height="16" rx="8" fill="var(--scarlet-ink)" />
        <rect x="178" y="136" width="32" height="16" rx="8" fill="var(--scarlet-ink)" />
        <rect x="160" y="142" width="20" height="4" rx="2" fill="var(--scarlet-ink)" />
        <path d="M147 180C157 184 165 185 170 185C176 185 183 184 194 180" stroke="var(--scarlet-ink)" strokeWidth="3" strokeLinecap="round" />
        <path d="M122 321C131 332 142 338 152 340" stroke="var(--scarlet-silver)" strokeOpacity="0.38" strokeWidth="4" strokeLinecap="round" />
        <path d="M218 321C209 332 198 338 188 340" stroke="var(--scarlet-silver)" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function CarArtwork() {
  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-[22px]">
      <svg viewBox="0 0 640 320" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="carBackground" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="var(--scarlet-burgundy)" />
            <stop offset="100%" stopColor="var(--scarlet-ink)" />
          </linearGradient>
          <linearGradient id="carStreak" x1="0%" x2="100%" y1="50%" y2="50%">
            <stop offset="0%" stopColor="var(--scarlet-glow)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--scarlet-glow)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--scarlet-glow)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="carBody" x1="10%" x2="90%" y1="20%" y2="80%">
            <stop offset="0%" stopColor="var(--scarlet-ink-soft)" />
            <stop offset="45%" stopColor="var(--scarlet-ink)" />
            <stop offset="100%" stopColor="var(--scarlet-graphite)" />
          </linearGradient>
        </defs>

        <rect width="640" height="320" fill="url(#carBackground)" />
        <rect x="-20" y="84" width="680" height="4" fill="url(#carStreak)" />
        <rect x="-20" y="114" width="680" height="5" fill="url(#carStreak)" opacity="0.7" />
        <rect x="-20" y="126" width="680" height="3" fill="url(#carStreak)" opacity="0.5" />
        <rect x="-20" y="235" width="680" height="6" fill="var(--scarlet-glow)" opacity="0.18" />
        <ellipse cx="380" cy="270" rx="172" ry="20" fill="var(--scarlet-shadow)" />

        <path
          d="M98 231H138C149 188 184 168 232 163L344 149C382 145 429 145 474 153C499 158 532 176 570 207L614 217C627 220 636 232 636 246V249H592C586 275 561 292 528 292C495 292 470 275 464 249H286C280 275 255 292 222 292C189 292 164 275 158 249H98V231Z"
          fill="url(#carBody)"
        />
        <path
          d="M245 167C274 136 318 124 396 128C432 130 460 135 493 146L548 205H228L245 167Z"
          fill="var(--scarlet-ink)"
        />
        <path
          d="M269 170C297 145 334 136 392 140C420 141 442 145 469 153L510 199H251L269 170Z"
          fill="var(--scarlet-graphite)"
        />
        <path d="M378 141L355 199" stroke="var(--scarlet-silver)" strokeOpacity="0.22" strokeWidth="3" />
        <path d="M301 203H512" stroke="var(--scarlet-silver)" strokeOpacity="0.18" strokeWidth="2" />
        <circle cx="223" cy="248" r="41" fill="var(--scarlet-ink)" />
        <circle cx="223" cy="248" r="24" fill="var(--scarlet-graphite)" />
        <circle cx="223" cy="248" r="10" fill="var(--scarlet-silver)" />
        <circle cx="528" cy="248" r="41" fill="var(--scarlet-ink)" />
        <circle cx="528" cy="248" r="24" fill="var(--scarlet-graphite)" />
        <circle cx="528" cy="248" r="10" fill="var(--scarlet-silver)" />
        <rect x="571" y="198" width="38" height="10" rx="5" fill="var(--scarlet-skin-deep)" opacity="0.6" />
      </svg>

      <div className="absolute inset-x-0 bottom-7 px-5 sm:px-6">
        <h3 className="text-[1.75rem] leading-none font-semibold tracking-[-0.05em] text-[var(--scarlet-card)] drop-shadow-sm sm:text-[2.2rem]">
          Fast &amp; Efficient Turnarounds
        </h3>
      </div>
    </div>
  )
}

function PhoneArtwork() {
  return (
    <div
      className="relative flex min-h-[320px] items-end justify-center overflow-hidden rounded-[22px] px-5 pt-10"
      style={dottedBackdrop}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 0%, transparent 72%, var(--scarlet-glow) 100%)' }}
      />
      <div
        className="relative h-[340px] w-[206px] rounded-[38px] border-[4px] border-[var(--scarlet-ink)] bg-[var(--scarlet-card)] shadow-[0_22px_44px_var(--scarlet-shadow-soft)]"
        style={{ boxShadow: '0 22px 44px var(--scarlet-shadow-soft)' }}
      >
        <div className="absolute left-1/2 top-3 h-5 w-[54px] -translate-x-1/2 rounded-full bg-[var(--scarlet-ink)]" />
        <svg viewBox="0 0 206 340" className="h-full w-full rounded-[34px]" aria-hidden="true">
          <defs>
            <linearGradient id="handGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="var(--scarlet-skin)" />
              <stop offset="100%" stopColor="var(--scarlet-skin-deep)" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="206" height="340" fill="var(--scarlet-card)" />
          <path
            d="M28 276C45 258 56 244 67 228C78 211 86 192 92 166C96 148 101 145 106 145C111 145 115 149 117 158C119 171 118 193 112 220L99 278L66 322L28 322V276Z"
            fill="url(#handGradient)"
          />
          <path
            d="M178 276C161 258 150 244 139 228C128 211 120 192 114 166C110 148 105 145 100 145C95 145 91 149 89 158C87 171 88 193 94 220L107 278L140 322H178V276Z"
            fill="url(#handGradient)"
          />
          <path
            d="M89 161C88 147 91 133 99 121C102 116 105 116 108 121C116 133 119 147 118 161L112 190H94L89 161Z"
            fill="url(#handGradient)"
          />
          <path d="M94 189H112L109 260H97L94 189Z" fill="url(#handGradient)" />
          <path d="M90 164C86 166 82 171 79 177" stroke="var(--scarlet-cream)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <path d="M116 164C120 166 124 171 127 177" stroke="var(--scarlet-cream)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>
    </div>
  )
}

function PortraitCard() {
  return (
    <SurfaceCard className="h-full">
      <CardContent className="flex h-full flex-col px-5 pb-0 pt-4 sm:px-6 sm:pt-5">
        <h2 className="text-[2.45rem] leading-[0.95] font-semibold tracking-[-0.08em] text-[var(--scarlet-text)] sm:text-[3.4rem]">
          Cutting-Edge <span className="text-[var(--scarlet-muted)]">Creativity</span>
        </h2>
        <div className="mt-6 grow">
          <PortraitArtwork />
        </div>
      </CardContent>
    </SurfaceCard>
  )
}

function CarCard() {
  return (
    <SurfaceCard>
      <CardContent className="p-1.5">
        <CarArtwork />
      </CardContent>
    </SurfaceCard>
  )
}

function PhoneCard() {
  return (
    <SurfaceCard>
      <CardContent className="p-1.5">
        <PhoneArtwork />
      </CardContent>
    </SurfaceCard>
  )
}

function SatisfactionCard() {
  return (
    <SurfaceCard>
      <CardContent className="flex h-full items-center gap-4 px-5 py-4 sm:px-6">
        <div className="flex -space-x-2">
          <Avatar className="h-10 w-10 border-2 border-[var(--scarlet-card)] bg-[var(--scarlet-ink)]">
            <AvatarFallback className="bg-[var(--scarlet-ink)] text-xs font-semibold text-[var(--scarlet-card)]">AN</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10 border-2 border-[var(--scarlet-card)] bg-[var(--scarlet-accent)]">
            <AvatarFallback className="bg-[var(--scarlet-accent)] text-xs font-semibold text-[var(--scarlet-card)]">LI</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10 border-2 border-[var(--scarlet-card)] bg-[var(--scarlet-silver)]">
            <AvatarFallback className="bg-[var(--scarlet-silver)] text-xs font-semibold text-[var(--scarlet-text)]">CE</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-1">
          <div className="text-[0.8rem] tracking-[0.28em] text-[var(--scarlet-accent)]">★★★★★</div>
          <p className="text-sm font-medium text-[var(--scarlet-muted)]">
            <span className="font-semibold text-[var(--scarlet-text)]">200+</span> Satisfied Clients
          </p>
        </div>
      </CardContent>
    </SurfaceCard>
  )
}

function LogosCard() {
  return (
    <SurfaceCard>
      <CardContent className="flex h-full items-center justify-between gap-5 overflow-hidden px-5 py-4 text-[var(--scarlet-muted-soft)] sm:px-6">
        {logoMarks.map((mark, index) => (
          <span
            key={`${mark}-${index}`}
            className="text-[1.1rem] font-semibold tracking-[0.14em] whitespace-nowrap opacity-[0.85]"
          >
            {mark}
          </span>
        ))}
      </CardContent>
    </SurfaceCard>
  )
}

export default function ScarletBenefitsPage() {
  return (
    <div className="scarlet-benefits-theme min-h-screen bg-[var(--scarlet-shell)] px-3 py-3 text-[var(--scarlet-text)] sm:px-5 sm:py-5">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        className="mx-auto max-w-[1240px] rounded-[30px] border border-[var(--scarlet-border)] bg-[var(--scarlet-panel)] px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
        style={{ boxShadow: 'inset 0 1px 0 var(--scarlet-glow), 0 26px 60px var(--scarlet-shadow)' }}
      >
        <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-start">
          <motion.div variants={riseIn} custom={0} className="pt-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--scarlet-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--scarlet-accent)]" />
              Benefits
            </div>
          </motion.div>

          <motion.div variants={riseIn} custom={1} className="max-w-[560px] justify-self-center pt-2 text-center">
            <h1 className="text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.085em] text-[var(--scarlet-text)] sm:text-[4.4rem]">
              Why Choose <span className="text-[var(--scarlet-muted)]">Scarlet?</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[35ch] text-[0.98rem] leading-6 text-[var(--scarlet-muted)] sm:text-[1rem]">
              We specialize in creating bold, high-impact digital experiences that set brands apart.
            </p>
          </motion.div>

          <motion.div variants={riseIn} custom={2} className="pt-4 lg:justify-self-end">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-[var(--scarlet-muted-soft)] bg-transparent px-5 text-[0.92rem] font-medium text-[var(--scarlet-muted)] shadow-none hover:bg-[var(--scarlet-card)] hover:text-[var(--scarlet-text)]"
            >
              <a href="mailto:hello@scarlet.studio">
                Let&apos;s talk <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-3 xl:grid-cols-[1.04fr_1fr_1.02fr] xl:grid-rows-[auto_minmax(320px,1fr)_auto_auto]">
          <motion.div variants={riseIn} custom={3} className="xl:row-span-4">
            <PortraitCard />
          </motion.div>

          <motion.div variants={riseIn} custom={4}>
            <CopyCard
              title="24/7 Email Support"
              description="Need assistance? Our team is always available to ensure a smooth and hassle-free experience. 24 hours response time."
              icon={Clock3}
            />
          </motion.div>

          <motion.div variants={riseIn} custom={5}>
            <CopyCard
              title="Seamless Collaboration"
              description="We work closely with you, keeping communication transparent and revisions efficient to bring your vision to life."
              icon={Lightbulb}
            />
          </motion.div>

          <motion.div variants={riseIn} custom={6}>
            <CarCard />
          </motion.div>

          <motion.div variants={riseIn} custom={7}>
            <PhoneCard />
          </motion.div>

          <motion.div variants={riseIn} custom={8}>
            <CopyCard
              title="Proven Expertise"
              description="We've helped multiple brands and businesses create stunning, high-impact designs that drive results."
              icon={BadgeCheck}
            />
          </motion.div>

          <motion.div variants={riseIn} custom={9}>
            <CopyCard
              title="Future-Ready Solutions"
              description="Our designs grow with your brand, ensuring long-term success and adaptability."
              icon={Zap}
            />
          </motion.div>

          <motion.div variants={riseIn} custom={10}>
            <SatisfactionCard />
          </motion.div>

          <motion.div variants={riseIn} custom={11}>
            <LogosCard />
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
