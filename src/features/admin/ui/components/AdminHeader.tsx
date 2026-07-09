import React from 'react';
import { useAuthStore } from '@/core/store/authStore';

interface Props {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: Props) {
  const { utilisateur } = useAuthStore();

  return (
    <header className="w-full top-0 sticky z-[40] bg-white/90 backdrop-blur-md border-b border-neutral-gray-200/80 shadow-sm animate-fade-in" id="admin-header">
      <div className="flex items-center justify-between px-6 md:px-8 w-full h-16 gap-4 relative">
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-headline-md text-headline-md font-black text-brand-red-deep md:hidden tracking-tight">École 221</span>
          <div className="hidden md:flex items-center text-neutral-gray-400 select-none">
            <span translate="no" className="material-symbols-outlined text-brand-red-deep text-[22px] animate-pulse">admin_panel_settings</span>
            <span className="ml-2 font-bold text-xs text-[#1E293B] uppercase tracking-wider">Pilotage Académique</span>
          </div>
        </div>

        {/* Info label center */}
        <div className="hidden sm:flex items-center justify-center flex-grow max-w-xl">
          <div className="bg-[#FAF8F6] border border-[#E2DCDA] rounded-full px-4 py-1.5 text-[11px] font-bold text-[#8E7977] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>Mode Administration Actif — {utilisateur?.name || 'Administrateur'}</span>
          </div>
        </div>

        {/* Actions right */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase rounded-xl bg-[#FFF5F5] hover:bg-[#FFEBEB] text-[#B3181C] border border-[#FFD1D1] transition-all cursor-pointer"
            title="Se déconnecter"
          >
            <span translate="no" className="material-symbols-outlined text-[16px]">logout</span>
            <span className="hidden md:inline">Quitter</span>
          </button>
        </div>
      </div>
    </header>
  );
}
