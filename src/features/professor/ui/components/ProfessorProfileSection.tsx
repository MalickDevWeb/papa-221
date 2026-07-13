import React from 'react';

interface ProfileProps {
  readonly profName: string;
  readonly initials: string;
  readonly onLogout: () => void;
}

export function ProfessorProfileSection({ profName, initials, onLogout }: ProfileProps) {
  return (
    <div className="mt-auto space-y-4 shrink-0 pt-4 border-t border-neutral-gray-200">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-neutral-gray-50 rounded-2xl border border-neutral-gray-150">
        <div className="w-9 h-9 rounded-xl bg-brand-red-deep text-white flex items-center justify-center font-black text-xs select-none">
          {initials || 'PR'}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black text-on-surface truncate">{profName}</h4>
          <p className="text-[9px] text-secondary font-semibold">Enseignant</p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2 text-secondary hover:bg-brand-red-light/50 hover:text-brand-red-deep font-label-md text-label-md rounded-lg cursor-pointer transition-colors"
      >
        <span translate="no" className="material-symbols-outlined text-[20px]">logout</span>
        <span>Déconnexion</span>
      </button>
    </div>
  );
}
