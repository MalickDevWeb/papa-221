import React from 'react';
import { Award, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { IMPROVEMENT_RATE } from './RecentAcademicPerformanceData';

export function RecentAcademicPerformanceHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 shrink-0 w-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#B3181C]/5 text-[#B3181C] border border-[#B3181C]/15 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 animate-pulse" />
            Performances Historiques
          </span>
          <span className="text-neutral-300 text-xs select-none">•</span>
          <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Moyenne Générale</span>
        </div>
        <h3 className="font-title-lg text-lg font-black text-[#291715] flex items-center gap-2 tracking-tight">
          <Award className="h-5 w-5 text-[#B3181C]" />
          Moyennes des 3 Derniers Semestres
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-[#FFF5F5] border border-[#B3181C]/10 text-[#B3181C] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 select-none">
          <TrendingUp className="h-3 w-3" />
          {IMPROVEMENT_RATE} Progression
        </div>
        <div className="bg-[#FAF8F6] border border-neutral-200 text-neutral-800 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 select-none">
          <Calendar className="h-3 w-3 text-[#E3A857]" />
          L2 ➔ L3
        </div>
      </div>
    </div>
  );
}
