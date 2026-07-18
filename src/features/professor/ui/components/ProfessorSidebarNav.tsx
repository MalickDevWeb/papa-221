import React from 'react';

interface NavProps {
  readonly activeTab: string;
  readonly onSelectTab: (tab: string) => void;
}

export function ProfessorSidebarNav({ activeTab, onSelectTab }: NavProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
    { id: 'classroom', label: 'Salle de Classe', icon: 'co_present' },
    { id: 'schedule', label: 'Mon Emploi du Temps', icon: 'calendar_today' },
    { id: 'collaboration', label: 'Espace Collaboration', icon: 'groups' },
  ];

  return (
    <nav className="flex flex-col gap-1 select-none">
      {menuItems.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onSelectTab(id)}
          className={`w-full flex flex-row items-center gap-3 px-3 py-2 font-label-md text-label-md rounded-lg transition-transform text-left cursor-pointer ${
            activeTab === id 
              ? 'bg-primary-container text-on-primary-container font-black' 
              : 'text-secondary hover:bg-secondary-container/50 hover:translate-x-1 font-semibold'
          }`}
        >
          <span translate="no" className="material-symbols-outlined text-center text-[22px]">{icon}</span>
          <span className="leading-none">{label}</span>
        </button>
      ))}
    </nav>
  );
}
