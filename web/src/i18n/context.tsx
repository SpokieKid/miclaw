/**
 * [INPUT]: Depends on i18n/translations for Locale, TranslationKey, translations map
 * [OUTPUT]: Exports LocaleProvider component, useLocale hook
 * [POS]: React context layer of i18n module, wraps App, consumed by all pages
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { translations, type Locale, type TranslationKey } from './translations'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
}

const STORAGE_KEY = 'miclaw-locale'

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'en' ? 'en' : 'zh'
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleRaw(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key],
    [locale],
  )

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  return (
    <LocaleContext value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
