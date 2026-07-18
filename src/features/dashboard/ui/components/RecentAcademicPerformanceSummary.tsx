import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CURRENT_GPA } from './RecentAcademicPerformanceData';

export function RecentAcademicPerformanceSummary() {
  return (
    <div className="md:col-span-4 bg-[#FAF8F6] rounded-2xl border border-neutral-200/50 p-4 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div>
          <p className="font-black text-[9px] text-neutral-400 uppercase tracking-widest">Évolution scolaire</p>
          <h4 className="text-lg font-black text-[#291715] tracking-tight mt-0.5">Note Max: 16.20</h4>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              GPA Équivalent
            </span>
            <span className="font-extrabold">{CURRENT_GPA.toFixed(1)} / 4.0</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-neutral-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E3A857]" />
              Statut global
            </span>
            <span className="font-black text-[#B3181C] uppercase text-[9px] tracking-wider bg-[#FFF5F5] px-2 py-0.5 rounded-lg border border-[#B3181C]/5">
              FÉLICITATIONS
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border border-neutral-200/60 rounded-xl space-y-1">
        <span className="text-[9px] font-black text-[#B3181C] uppercase tracking-widest flex items-center gap-1 leading-none">
          Prochain objectif
          <ArrowUpRight className="h-3 w-3" />
        </span>
        <p className="text-[9.5px] text-neutral-500 font-bold leading-normal">
          Maintenir la dynamique pour décrocher la mention "Très Bien" sur l'année de Licence entière.
        </p>
      </div>
    </div>
  );
}
