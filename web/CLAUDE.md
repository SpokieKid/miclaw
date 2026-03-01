# web/
> L2 | Parent: /CLAUDE.md

MiClaw frontend — Vite + React 19 + TypeScript + TailwindCSS v4 + shadcn/ui.
Warm editorial aesthetic: cream/beige palette, DM Serif Display headlines, Inter body text.

## DESIGN LAW

**All design must come from the design system.** No hardcoded hex/rgb/oklch values in components.
Every color is a CSS variable from `index.css`. Every component is from `components/ui/` or uses
design tokens only. Warm editorial palette: cream background, terracotta accents, bark text.

## Member List

src/main.tsx: Entry point, mounts React app to DOM #root
src/App.tsx: Root component, LocaleProvider + BrowserRouter + route to Home page
src/index.css: Tailwind v4 imports + warm editorial design tokens (cream/terracotta/bark palette)
src/lib/utils.ts: cn() utility for conditional classname merging
src/i18n/translations.ts: Typed ZH/EN translation map (Locale, TranslationKey, translations)
src/i18n/context.tsx: LocaleProvider + useLocale hook, localStorage persistence
src/pages/Home.tsx: Landing page — Nav + Hero + Demo + Battery + UseCases + Problem, all strings via t()
src/assets/: Static assets (SVGs)
src/components/ui/: 30 shadcn/ui primitives (button, card, dialog, form, tabs, etc.)
src/components/sections/: (empty, reserved for future section extraction)
src/hooks/: (empty, reserved for future custom hooks)
src/styles/: (empty, reserved for future custom stylesheets)
public/product-white.png: White MiClaw device product photo (hero image)
public/product-device.png: Dark MiClaw device product photo (unused)
public/product-lifestyle.png: Lifestyle product photo (unused)

## Tech Stack

React 19 + TypeScript + Vite + TailwindCSS v4 + shadcn/ui + react-router + framer-motion

## UI Libraries

- `shadcn/ui` — component primitives (amethyst-haze base, overridden with warm editorial tokens)
- `framer-motion` — scroll-reveal animations and parallax
- `lucide-react` — system icons
- `react-icons/si` — social media icons (Si prefix)
- `clsx` — conditional classnames
- `tailwind-variants` — component variant API for Tailwind
- `react-router` — client-side routing

## Design Tokens

- `--cream` (#f5f0ea) — primary background
- `--cream-dark` (#ebe4db) — secondary background, card fills
- `--terracotta` (#e8634a) — accent color for highlights
- `--bark` (#1a1714) — primary text, dark fills
- `--bark-light` (#8a7e72) — secondary text
- `--warm` (#c4b5a3) — muted elements
- `--sage` (#7a8a6e) — badge/tag accent

## Fonts

- Display: DM Serif Display (Google Fonts, `font-serif`)
- Body: Inter (Google Fonts, `font-sans`)

## Path Alias

`@/*` → `./src/*` (configured in vite.config.ts, tsconfig.json, and tsconfig.app.json)

[PROTOCOL]: Update this header on changes, then check CLAUDE.md
