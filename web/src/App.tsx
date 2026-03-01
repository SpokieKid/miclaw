/**
 * [INPUT]: Depends on react-router, pages/Home, i18n/context
 * [OUTPUT]: Exports App root component with routing + i18n
 * [POS]: Root component of frontend, mounted by main.tsx
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */


import { BrowserRouter, Routes, Route } from 'react-router'
import { LocaleProvider } from '@/i18n/context'
import Home from '@/pages/Home'

export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  )
}
