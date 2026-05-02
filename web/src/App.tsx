/**
 * [INPUT]: Depends on react-router, pages/Home, pages/About, pages/scarlet-benefits, i18n/context
 * [OUTPUT]: Exports App root component with routing + i18n
 * [POS]: Root component of frontend, mounted by main.tsx
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { BrowserRouter, Routes, Route } from 'react-router'
import { LocaleProvider } from '@/i18n/context'
import Home from '@/pages/Home'
import About from '@/pages/About'
import ScarletBenefitsPage from '@/pages/scarlet-benefits'

export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/scarlet-benefits" element={<ScarletBenefitsPage />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  )
}
