import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/core/store/authStore';

interface Props {
  onOpenSettings: () => void;
  triggerToast: (msg: string) => void;
}

export function StudentSidebar({ onOpenSettings, triggerToast }: Props) {
  const navigate = useNavigate();
  const { deconnexion } = useAuthStore();

  return (
    <aside
      style={{ paddingTop: '10px' }}
      className="hidden md:flex flex-col h-screen pb-8 gap-4 bg-surface-container-low border-r border-[#E0E0E0] w-64 fixed left-0 top-0 z-[20] px-4 select-none overflow-y-auto no-scrollbar"
    >
      <div className="mb-6 px-4 flex flex-col items-start">
        <div
          style={{
            paddingLeft: '11px',
            paddingRight: '1px',
            paddingTop: '7px',
            paddingBottom: '9px',
            marginLeft: '0px',
            marginTop: '-13px',
            marginRight: '0px',
            marginBottom: '0px',
          }}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B3181C] to-[#6B0E10] text-white flex items-center justify-center font-black shadow-md shadow-[#B3181C]/25 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={() => navigate(ROUTES.student.dashboard)}
        >
          <span translate="no" className="material-symbols-outlined text-[20px] font-bold">school</span>
        </div>
        <div className="flex flex-col mt-3">
          <h1 className="font-black text-[#1E293B] text-[15px] leading-tight tracking-tight">École 221</h1>
          <p className="text-[10px] font-black text-brand-red-deep uppercase tracking-widest mt-0.5">Portail Étudiant</p>
        </div>
        <p className="text-secondary font-label-md text-xs mt-1">Année Académique 2023-24</p>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {[
          { to: ROUTES.student.dashboard, icon: 'dashboard', label: 'Accueil' },
          { to: ROUTES.student.cours, icon: 'school', label: 'Cours' },
          { to: ROUTES.student.planning, icon: 'calendar_today', label: 'Planning' },
          { to: ROUTES.student.devoirs, icon: 'assignment', label: 'Devoirs' },
          { to: ROUTES.student.notes, icon: 'grade', label: 'Notes' },
          { to: ROUTES.student.collaboration, icon: 'groups', label: 'Collaboration' },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `flex flex-row items-center gap-3 px-3 py-2.5 font-label-md text-label-md rounded-lg transition-transform ${isActive ? 'bg-primary-container text-on-primary-container font-black' : 'text-secondary hover:bg-secondary-container/50 hover:translate-x-1 font-semibold'}`}
          >
            <span translate="no" className="material-symbols-outlined text-center text-[22px]">{icon}</span>
            <span className="leading-none">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 shrink-0">
        <NavLink
          to={ROUTES.student.tuteur}
          className={({ isActive }) =>
            `w-full flex flex-row items-center justify-start gap-3 px-3 py-3 text-white rounded-lg font-label-md text-label-md active:opacity-80 transition-all cursor-pointer ${
              isActive ? 'bg-[#5c2d2d] ring-2 ring-white/20' : 'bg-[#3f1e1e] hover:bg-[#522727]'
            }`
          }
        >
          <span translate="no" className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <span className="leading-none">Tuteur IA</span>
        </NavLink>

        <div className="pt-4 border-t border-neutral-gray-200">
          <button onClick={onOpenSettings} className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2 text-secondary hover:bg-secondary-container/50 font-label-md text-label-md rounded-lg cursor-pointer">
            <span translate="no" className="material-symbols-outlined text-[20px]">settings</span>
            <span>Paramètres</span>
          </button>
          <button
            onClick={() => {
              deconnexion();
              localStorage.removeItem('access_token');
              triggerToast('Déconnexion réussie !');
              setTimeout(() => navigate(ROUTES.login), 800);
            }}
            className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2 text-secondary hover:bg-brand-red-light/50 hover:text-brand-red-deep font-label-md text-label-md rounded-lg cursor-pointer"
          >
            <span translate="no" className="material-symbols-outlined text-[20px]">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
