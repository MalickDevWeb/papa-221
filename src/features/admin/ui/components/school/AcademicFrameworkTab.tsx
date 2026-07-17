import React, { useState } from 'react';
import { AcademicYearsSection } from './academic/AcademicYearsSection';
import { ProgramBuilderSection } from './academic/ProgramBuilderSection';
import { SchedulerSection } from './academic/SchedulerSection';

export function AcademicFrameworkTab() {
  const [subTab, setSubTab] = useState<'years' | 'programs' | 'schedule'>('years');

  return (
    <div className="space-y-6" id="academic-framework-tab">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#B3181C]" />
            Moteur de Cadre Académique & Pédagogique
          </h3>
          <p className="text-[11px] text-neutral-400 font-bold mt-0.5">
            Configurez les années, les programmes d'études, les crédits ECTS, et gérez les affectations d'enseignants.
          </p>
        </div>

        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setSubTab('years')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              subTab === 'years' ? 'bg-white text-[#B3181C] shadow-3xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Années & Sessions
          </button>
          <button
            onClick={() => setSubTab('programs')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              subTab === 'programs' ? 'bg-white text-[#B3181C] shadow-3xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Modules & Crédits
          </button>
          <button
            onClick={() => setSubTab('schedule')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              subTab === 'schedule' ? 'bg-white text-[#B3181C] shadow-3xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Affectations & Examens
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        {subTab === 'years' && <AcademicYearsSection />}
        {subTab === 'programs' && <ProgramBuilderSection />}
        {subTab === 'schedule' && <SchedulerSection />}
      </div>
    </div>
  );
}
