import React from 'react';

interface HeatmapProps {
  presenceRate: number;
  absenceRate: number;
  punctuality: number;
}

export function AttendanceHeatmap({ presenceRate, absenceRate, punctuality }: HeatmapProps) {
  return (
    <div className="space-y-4" id="attendance-heatmap-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-neutral-100 p-3 bg-emerald-50/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Taux de Présence</p>
            <p className="text-emerald-700 font-black text-base mt-0.5">{presenceRate}%</p>
          </div>
          <span translate="no" className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
        </div>
        <div className="border border-neutral-100 p-3 bg-rose-50/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-rose-800 font-bold uppercase tracking-wider">Taux d'Absence</p>
            <p className="text-rose-700 font-black text-base mt-0.5">{absenceRate}%</p>
          </div>
          <span translate="no" className="material-symbols-outlined text-rose-600 text-xl">cancel</span>
        </div>
        <div className="border border-neutral-100 p-3 bg-amber-50/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Ponctualité (À l'heure)</p>
            <p className="text-amber-700 font-black text-base mt-0.5">{punctuality}%</p>
          </div>
          <span translate="no" className="material-symbols-outlined text-amber-600 text-xl">schedule</span>
        </div>
      </div>

      <div className="border border-neutral-100 p-3.5 bg-neutral-50/30 rounded-2xl">
        <h4 className="font-extrabold text-[#1E293B] text-[11px] uppercase tracking-wider mb-2 text-[#B3181C] flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-sm">grid_on</span>
          Heatmap de Présence Mensuelle (Juillet 2026)
        </h4>
        <div className="grid grid-cols-7 gap-1 max-w-xs mx-auto">
          {Array.from({ length: 31 }).map((_, idx) => {
            const day = idx + 1;
            const isWeekend = day % 7 === 0 || day % 7 === 6;
            const status = isWeekend ? 'weekend' : day === 13 ? 'absent' : day === 14 ? 'retard' : 'present';
            const color = status === 'weekend' ? 'bg-neutral-100' : status === 'absent' ? 'bg-rose-500' : status === 'retard' ? 'bg-amber-500' : 'bg-emerald-500';
            return (
              <div key={idx} className={`h-6 w-full rounded flex items-center justify-center text-[9px] font-black text-white ${color}`} title={`Jour ${day}`}>
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-3 mt-3 text-[9px] font-black uppercase">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Présent</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Absent</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Retard</div>
        </div>
      </div>
    </div>
  );
}
