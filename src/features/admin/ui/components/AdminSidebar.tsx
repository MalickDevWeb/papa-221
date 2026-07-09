import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/core/store/authStore';

interface Props {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: Props) {
  const navigate = useNavigate();

  return (
    <aside
      className="hidden md:flex flex-col h-screen pb-8 gap-4 bg-surface-container-low border-r border-[#E0E0E0] w-64 fixed left-0 top-0 z-[20] px-4 select-none overflow-y-auto no-scrollbar"
      style={{ paddingTop: '10px' }}
      id="admin-sidebar"
    >
      <div className="mb-6 px-4 flex flex-col items-start">
        <div
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B3181C] to-[#6B0E10] text-white flex items-center justify-center font-black shadow-md shadow-[#B3181C]/25 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={() => navigate(ROUTES.admin.dashboard)}
        >
          <span translate="no" className="material-symbols-outlined text-[20px] font-bold">admin_panel_settings</span>
        </div>
        <div className="flex flex-col mt-3">
          <h1 className="font-black text-[#1E293B] text-[15px] leading-tight tracking-tight">École 221</h1>
          <p className="text-[10px] font-black text-brand-red-deep uppercase tracking-widest mt-0.5">Portail Admin</p>
        </div>
        <p className="text-secondary font-label-md text-xs mt-1">Année Académique 2023-24</p>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        <button
          onClick={() => navigate(ROUTES.admin.dashboard)}
          className="flex flex-row items-center gap-3 px-3 py-2.5 font-label-md text-label-md rounded-lg transition-transform bg-primary-container text-on-primary-container font-black w-full text-left"
        >
          <span translate="no" className="material-symbols-outlined text-center text-[22px]">dashboard</span>
          <span className="leading-none">Vue d'ensemble</span>
        </button>
      </nav>

      <div className="mt-auto space-y-2 shrink-0 pt-4 border-t border-neutral-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2 text-secondary hover:bg-brand-red-light/50 hover:text-brand-red-deep font-label-md text-label-md rounded-lg cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-[20px]">logout</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
