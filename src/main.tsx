import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/core/providers/AppProviders'
import { AppRouter } from '@/core/router/AppRouter'
import '@/shared/design/reset.css'
import '@/shared/design/tokens.css'

// Global safety patch to catch unhandled promise rejections from play() interruptions
// (e.g., when a camera video or audio beep element is removed from the DOM mid-play)
if (typeof window !== 'undefined' && typeof HTMLMediaElement !== 'undefined') {
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (...args: any[]) {
    const promise = originalPlay.apply(this, args);
    if (promise && typeof promise.catch === 'function') {
      promise.catch((err: any) => {
        if (err && err.name === 'AbortError') {
          // Safe to ignore: play request was interrupted by component unmount or stop
          return;
        }
        console.warn("Media play failed or was interrupted:", err);
      });
    }
    return promise;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
);

// Enregistrement du Service Worker pour la PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch((error) => {
        console.error('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

