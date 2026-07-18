import React from 'react';

interface Props {
  readonly viewMode: 'focus' | 'all';
  readonly setViewMode: (mode: 'focus' | 'all') => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function WeeklyScheduleHeader({ viewMode, setViewMode, onPrev, onNext }: Props) {
  return (
    <div className="flex justify-between items-center shrink-0" id="weekly-schedule-header">
      <h3 className="font-title-lg text-xs font-black flex items-center gap-1.5 text-[#291715] uppercase tracking-wide">
        <span translate="no" className="material-symbols-outlined text-brand-red-deep text-lg">calendar_month</span>
        Emploi du temps
      </h3>
      
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/50">
          <button
            onClick={() => setViewMode('focus')}
            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-md transition-colors cursor-pointer ${
              viewMode === 'focus' ? 'bg-white text-brand-red-deep shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Focus (3 jours)
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-md transition-colors cursor-pointer ${
              viewMode === 'all' ? 'bg-white text-brand-red-deep shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Semaine Complète
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-1 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600 transition-colors cursor-pointer flex items-center justify-center"
            title="Jour précédent"
          >
            <span translate="no" className="material-symbols-outlined text-sm font-bold">chevron_left</span>
          </button>
          <button
            onClick={onNext}
            className="p-1 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600 transition-colors cursor-pointer flex items-center justify-center"
            title="Jour suivant"
          >
            <span translate="no" className="material-symbols-outlined text-sm font-bold">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
