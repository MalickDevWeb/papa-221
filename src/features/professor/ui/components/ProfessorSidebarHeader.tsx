import React from 'react';

interface HeaderProps {
  readonly onSelectTab: (tab: string) => void;
}

export function ProfessorSidebarHeader({ onSelectTab }: HeaderProps) {
  return (
    <div className="mb-4 px-4 pt-5 flex flex-col items-start select-none">
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
        onClick={() => onSelectTab('dashboard')} 
        className="w-11 h-11 rounded-2xl bg-brand-red-deep text-white flex items-center justify-center font-black shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <span translate="no" className="material-symbols-outlined text-[20px] font-bold">school</span>
      </div>
      <div className="flex flex-col mt-3">
        <h1 className="font-black text-[#1E293B] text-[15px] leading-tight tracking-tight">École 221</h1>
        <p className="text-[10px] font-black text-brand-red-deep uppercase tracking-widest mt-0.5">Espace Enseignant</p>
      </div>
      <p className="text-secondary font-label-md text-xs mt-1">Année Académique 2023-24</p>
    </div>
  );
}
