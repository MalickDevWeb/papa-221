import React from 'react';

interface GradesAnalyticsProps {
  averageMoyenne: number;
  validatedECTS: number;
  currentGPA: number;
}

export function GradesAnalytics({ averageMoyenne, validatedECTS, currentGPA }: GradesAnalyticsProps) {
  const ectsPercentage = Math.min(100, Math.max(0, (validatedECTS / 30) * 100));

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* GPA Card */}
      <div className="sm:col-span-1 lg:col-span-1 bg-white border border-neutral-gray-200 p-6 rounded-2xl relative overflow-hidden group shadow-xs transition-all hover:shadow-sm">
        <div className="relative z-10">
          <p className="text-secondary font-label-md text-xs uppercase mb-2 font-bold tracking-wider text-neutral-500">Moyenne Générale</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#291715] tracking-tight transition-all duration-300">
              {averageMoyenne.toFixed(2)}
            </span>
            <span className="text-secondary text-sm font-bold text-neutral-400">/ 20</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-success-green">
              <span translate="no" className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+0.8 vs Sem 1</span>
            </div>
            <div className="bg-success-green/10 text-success-green px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
              GPA {currentGPA.toFixed(1)}
            </div>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] text-brand-red-light opacity-30 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
          <span translate="no" className="material-symbols-outlined text-[100px] sm:text-[110px]">analytics</span>
        </div>
      </div>

      {/* ECTS Card */}
      <div className="sm:col-span-1 lg:col-span-1 bg-white border border-neutral-gray-200 p-6 rounded-2xl shadow-xs hover:shadow-sm transition-all">
        <p className="text-secondary font-label-md text-xs uppercase mb-2 font-bold tracking-wider text-neutral-500">Crédits ECTS</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-[#291715] tracking-tight transition-all duration-300">
            {validatedECTS}
          </span>
          <span className="text-secondary text-sm font-bold text-neutral-400">/ 30 validés</span>
        </div>
        <div className="w-full bg-neutral-gray-150 h-2 rounded-full mt-5 overflow-hidden">
          <div 
            className="bg-[#B3181C] h-full rounded-full transition-all duration-500"
            style={{ width: `${ectsPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tableau d'Excellence / Distinction Card */}
      <div className="sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#291715] to-[#452724] text-white p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all relative overflow-hidden group">
        <div className="flex-1 relative z-10">
          <p className="text-[#E3A857] text-[10px] uppercase mb-1.5 font-black tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">workspace_premium</span>
            Tableau d'Excellence Académique
          </p>
          <p className="text-white/80 text-[11px] font-medium leading-relaxed max-w-sm mb-3.5">
            Félicitations ! Vos performances vous placent parmi les meilleurs étudiants de votre promotion ce semestre.
          </p>
          <div className="flex items-center gap-1.5 bg-white/15 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-500/20">
            <span translate="no" className="material-symbols-outlined text-xs">verified</span>
            {averageMoyenne >= 16 ? "Mention Très Bien" : averageMoyenne >= 14 ? "Mention Bien" : averageMoyenne >= 12 ? "Mention Assez Bien" : "Mention Passable"}
          </div>
        </div>
        <div className="absolute right-[-5%] top-[-10%] text-white/5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
          <span translate="no" className="material-symbols-outlined text-[100px] sm:text-[110px]">military_tech</span>
        </div>
      </div>
    </div>
  );
}
