import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initEruda } from './lib/eruda'

// Start the on-device debug console (only when enabled — see src/lib/eruda.ts).
void initEruda()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
