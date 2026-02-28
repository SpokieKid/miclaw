/**
 * [INPUT]: Depends on App root component, index.css for Tailwind
 * [OUTPUT]: Mounts React app to DOM #root element
 * [POS]: Entry point of frontend, consumed by Vite bundler
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
