import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '@/shared/hooks/usePWAInstall';

export function PWAInstallBanner() {
  const { isInstallable, handleInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Only show if PWA is installable and not previously dismissed in this session
    if (isInstallable) {
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setIsDismissed(false);
      }
    } else {
      setIsDismissed(true);
    }
  }, [isInstallable]);

  const onDismiss = () => {
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
    setIsDismissed(true);
  };

  const onInstallClick = async () => {
    await handleInstall();
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-[380px] z-[9999] bg-white border border-neutral-gray-200/80 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-red-light flex items-center justify-center shrink-0 border border-brand-red-deep/10">
          <span className="material-symbols-outlined text-brand-red-deep text-[28px]">school</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-neutral-gray-900 leading-tight">Installer École 221</h4>
          <p className="text-xs text-neutral-gray-500 mt-1 leading-relaxed">
            Ajoutez l'application sur votre écran d'accueil pour un accès ultra-rapide et un mode hors-ligne fluide.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-neutral-gray-400 hover:text-neutral-gray-600 transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-neutral-gray-50"
          aria-label="Fermer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-xs font-bold text-neutral-gray-500 hover:text-neutral-gray-700 hover:bg-neutral-gray-50 rounded-xl transition-all cursor-pointer"
        >
          Plus tard
        </button>
        <button
          onClick={onInstallClick}
          className="px-4 py-1.5 text-xs font-bold text-white bg-brand-red-deep hover:bg-brand-red-dark shadow-sm hover:shadow rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">download</span>
          Installer
        </button>
      </div>
    </div>
  );
}
