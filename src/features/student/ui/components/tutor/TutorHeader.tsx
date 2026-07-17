import React from 'react';

export function TutorHeader() {
  return (
    <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2" id="tutor-header">
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span translate="no" className="material-symbols-outlined text-[#3f1e1e] text-[24px]">smart_toy</span>
          <h1 className="text-xl font-black text-[#291715] tracking-tight uppercase">Tuteur IA Personnel</h1>
        </div>
        <p className="text-[10px] font-semibold text-secondary leading-normal">
          Conseiller pédagogique interactif et expert d'étude personnalisé pour l'École 221
        </p>
      </div>
    </div>
  );
}
