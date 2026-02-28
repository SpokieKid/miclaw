/**
 * [INPUT]: Depends on react-router, pages/Home
 * [OUTPUT]: Exports App root component with routing
 * [POS]: Root component of frontend, mounted by main.tsx
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { BrowserRouter, Routes, Route } from 'react-router'
import Home from '@/pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
