import React from 'react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose?: () => void;
}

export function PlanningSubSidebar({ activeTab, onSelectTab, isCollapsed, onToggleCollapse, onClose }: Props) {
  const menuItems = [
    { id: 'calendar', label: 'Calendrier & Salles', icon: 'calendar_today' },
    { id: 'conflicts', label: 'Matrice des Conflits', icon: 'warning' },
    { id: 'ai_opt', label: 'Assistant IA Planner', icon: 'psychology' },
  ];

  return (
    <div
      className={`bg-white border border-[#E2DCDA] rounded-2xl p-4 flex flex-col transition-all duration-300 gap-4 shrink-0 shadow-sm ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      id="planning-subsidebar"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        {!isCollapsed && (
          <span className="text-xs font-black uppercase tracking-wider text-[#1E293B]">
            Moteur de Planification
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors flex items-center justify-center cursor-pointer"
            title={isCollapsed ? 'Ouvrir' : 'Réduire'}
          >
            <span translate="no" className="material-symbols-outlined text-lg font-bold">
              {isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
            </span>
          </button>
          {!isCollapsed && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#B3181C]/10 text-neutral-500 hover:text-[#B3181C] transition-colors flex items-center justify-center cursor-pointer"
              title="Masquer le volet"
            >
              <span translate="no" className="material-symbols-outlined text-lg">
                visibility_off
              </span>
            </button>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all w-full text-left cursor-pointer ${
                isActive
                  ? 'bg-[#B3181C]/10 text-[#B3181C]'
                  : 'text-[#4A5568] hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              title={item.label}
            >
              <span translate="no" className="material-symbols-outlined text-lg shrink-0">
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate leading-none">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
