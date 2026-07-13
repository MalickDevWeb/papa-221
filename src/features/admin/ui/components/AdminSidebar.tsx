import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';

interface Props {
  onLogout: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard CEO', icon: 'dashboard' },
  { id: 'school', label: 'Gestion École', icon: 'school' },
  { id: 'schedule', label: 'Emploi du Temps', icon: 'calendar_today' },
  { id: 'personnel', label: 'Gestion Personnel', icon: 'badge' },
  { id: 'students', label: 'Gestion Élèves', icon: 'group' },
  { id: 'admissions', label: 'Admissions', icon: 'person_add' },
  { id: 'finances', label: 'Finances & Recouvre', icon: 'payments' },
  { id: 'notifications', label: 'Notifications Hub', icon: 'mail' },
  { id: 'ai', label: 'Assistant IA', icon: 'smart_toy' },
  { id: 'security', label: 'Sécurité & Audit', icon: 'security' },
];

export function AdminSidebar({ onLogout, activeTab, onSelectTab, isCollapsed, onToggleCollapse }: Props) {
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen pb-6 gap-3 bg-[#FAF8F6] border-r border-[#E2DCDA] fixed left-0 top-0 z-[20] px-3 select-none overflow-y-auto no-scrollbar transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ paddingTop: '10px' }}
      id="admin-sidebar"
    >
      <div className="flex items-center justify-between px-2 mb-4 shrink-0">
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="font-black text-[#1E293B] text-[15px] leading-tight tracking-tight">École 221</h1>
            <p className="text-[10px] font-black text-[#B3181C] uppercase tracking-widest mt-0.5">Admin ERP</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-600 transition-colors ml-auto flex items-center cursor-pointer"
          title={isCollapsed ? "Agrandir la barre" : "Réduire la barre"}
        >
          <span translate="no" className="material-symbols-outlined text-lg font-bold">
            {isCollapsed ? 'arrow_forward_ios' : 'arrow_back_ios'}
          </span>
        </button>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-row items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all w-full text-left cursor-pointer ${
                isActive
                  ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/15'
                  : 'text-[#4A5568] hover:bg-[#F1EFEF] hover:text-[#1E293B]'
              }`}
              title={item.label}
            >
              <span translate="no" className="material-symbols-outlined text-center text-[20px]">
                {item.icon}
              </span>
              {!isCollapsed && <span className="leading-none truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 shrink-0 pt-3 border-t border-neutral-200">
        <button
          onClick={onLogout}
          className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2 text-neutral-600 hover:bg-[#FFF5F5] hover:text-[#B3181C] text-xs font-bold rounded-xl cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-[18px]">logout</span>
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
