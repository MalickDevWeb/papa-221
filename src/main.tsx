import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/core/providers/AppProviders'
import { AppRouter } from '@/core/router/AppRouter'
import '@/shared/design/reset.css'
import '@/shared/design/tokens.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
)
