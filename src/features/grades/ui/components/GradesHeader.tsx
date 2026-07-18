import React from 'react';

interface GradesHeaderProps {
  onDownload?: () => void;
  averageMoyenne: number;
}

export function GradesHeader({ onDownload, averageMoyenne }: GradesHeaderProps) {
  const getRank = (avg: number) => {
    if (avg >= 18) return { rank: '1er', top: 'Top 1% de la cohorte' };
    if (avg >= 17) return { rank: '2ème', top: 'Top 1.5% de la cohorte' };
    if (avg >= 16.5) return { rank: '3ème', top: 'Top 2% de la cohorte' };
    if (avg >= 16) return { rank: '4ème', top: 'Top 3% de la cohorte' };
    if (avg >= 15) return { rank: '7ème', top: 'Top 5% de la cohorte' };
    if (avg >= 14) return { rank: '12ème', top: 'Top 8% de la cohorte' };
    if (avg >= 12) return { rank: '28ème', top: 'Top 20% de la cohorte' };
    if (avg >= 10) return { rank: '62ème', top: 'Top 45% de la cohorte' };
    return { rank: '105ème', top: 'Deuxième partie de classe' };
  };

  const rankInfo = getRank(averageMoyenne);

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8 gap-4 select-none">
      <div className="w-full sm:max-w-xl flex items-center gap-4 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-neutral-gray-200/45 sm:border-none shadow-xs sm:shadow-none">
        <div className="w-12 h-12 rounded-full bg-brand-red-light/30 flex items-center justify-center text-[#B3181C] shrink-0">
          <span translate="no" className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Rang Promotionnel Actuel</span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-black tracking-tight text-[#291715] flex items-baseline gap-1.5">
            {rankInfo.rank} <span className="text-xs sm:text-sm font-bold text-neutral-400">sur 142 étudiants</span>
          </h1>
          <p className="text-xs font-bold text-[#E3A857] uppercase tracking-wide mt-0.5">
            {rankInfo.top}
          </p>
        </div>
      </div>
      <button 
        onClick={onDownload}
        className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#B3181C] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#8c1215] transition-all active:scale-95 shadow-sm cursor-pointer border border-[#B3181C]/20 shrink-0"
      >
        <span translate="no" className="material-symbols-outlined text-sm">download</span>
        Télécharger le relevé officiel
      </button>
    </div>
  );
}
