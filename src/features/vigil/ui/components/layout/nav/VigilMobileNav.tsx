import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';

export function VigilMobileNav() {
  return (
    <nav className="w-full bg-white flex justify-around items-center h-16 px-2">
      {[
        { to: ROUTES.vigil.dashboard, icon: 'qr_code_scanner', label: 'Scan' },
        { to: ROUTES.vigil.rapports, icon: 'history', label: 'Historique' },
        { to: '/vigile/profil', icon: 'account_circle', label: 'Profil' },
      ].map(({ to, icon, label }) => (
        <NavLink 
          key={to} 
          to={to} 
          end 
          className={({ isActive }) => `flex flex-col items-center justify-center transition-all duration-150 py-1.5 flex-1 ${
            isActive 
              ? 'text-[#E31E24] font-black' 
              : 'text-neutral-500 hover:text-neutral-800 font-bold'
          }`}
        >
          <span translate="no" className="material-symbols-outlined text-[23px]">{icon}</span>
          <span className="text-[10px] tracking-wide mt-0.5 truncate max-w-full text-center">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
