import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useDeviceStore } from '../../hooks/useDeviceStore';
import { useAuthStore } from '@/core/store/authStore';

export function ScreenGuardBanner() {
  const { isDesktop, hasBypassed } = useDeviceStore();
  const { utilisateur } = useAuthStore();

  const isAdmin = utilisateur?.role === 'ADMIN' || utilisateur?.role === 'SUPER_ADMIN';
  const showBanner = !isDesktop && hasBypassed && isAdmin;

  if (!showBanner) return null;

  return (
    <div
      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 shadow-sm z-[9990] flex items-center justify-center gap-2.5 text-[11px] font-black uppercase tracking-wider relative select-none animate-slide-down shrink-0 font-sans border-b border-amber-600/25"
      id="screenguard-amber-banner"
    >
      <ShieldAlert className="h-4 w-4 animate-pulse stroke-[2.5]" />
      <span>Mode dégradé actif — Certaines fonctionnalités de gestion sont limitées sur cet écran</span>
    </div>
  );
}
