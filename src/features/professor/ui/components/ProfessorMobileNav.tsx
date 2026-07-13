import React from 'react';

interface Props {
  readonly activeTab: string;
  readonly onSelectTab: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'classroom', label: 'Classe', icon: 'co_present' },
  { id: 'schedule', label: 'Planning', icon: 'calendar_today' },
];

export function ProfessorMobileNav({ activeTab, onSelectTab }: Props) {
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-[70] border-t border-neutral-gray-150 bg-white/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around py-2 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-colors ${
              activeTab === id ? 'text-brand-red-deep' : 'text-neutral-gray-400'
            }`}
          >
            <span translate="no" className="material-symbols-outlined text-[20px]">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
