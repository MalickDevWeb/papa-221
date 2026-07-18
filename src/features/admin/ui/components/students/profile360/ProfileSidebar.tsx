import React from 'react';

export type ProfileTabSection =
  | 'general'
  | 'academic'
  | 'grades'
  | 'attendance'
  | 'finances'
  | 'activities'
  | 'security'
  | 'communication'
  | 'ai';

interface SectionItem {
  id: ProfileTabSection;
  label: string;
  icon: string;
}

const SECTION_ITEMS: SectionItem[] = [
  { id: 'general', label: 'Général & Identité', icon: 'contact_page' },
  { id: 'academic', label: 'Parcours Académique', icon: 'history_edu' },
  { id: 'grades', label: 'Notes & Évaluations', icon: 'grade' },
  { id: 'attendance', label: 'Assiduité & Discipline', icon: 'calendar_today' },
  { id: 'finances', label: 'Finances & Documents', icon: 'payments' },
  { id: 'activities', label: 'Vie Universitaire & Projets', icon: 'groups' },
  { id: 'security', label: 'Sécurité & Logs', icon: 'admin_panel_settings' },
  { id: 'communication', label: 'Communication & Timeline', icon: 'forum' },
  { id: 'ai', label: '🔬 Diagnostic IA', icon: 'psychology' }
];

interface Props {
  activeSection: ProfileTabSection;
  onSelectSection: (section: ProfileTabSection) => void;
}

export function ProfileSidebar({ activeSection, onSelectSection }: Props) {
  return (
    <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-neutral-100 pb-2 lg:pb-0 lg:pr-4 shrink-0 lg:w-56 scrollbar-thin">
      {SECTION_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl transition-all whitespace-nowrap text-xs font-extrabold cursor-pointer w-auto lg:w-full ${
              isActive
                ? 'bg-[#B3181C]/10 text-[#B3181C]'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <span translate="no" className="material-symbols-outlined text-base shrink-0">
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
