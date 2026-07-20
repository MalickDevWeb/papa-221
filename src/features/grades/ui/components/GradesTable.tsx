import React from 'react';

interface GradeItem {
  module: string;
  prof: string;
  ects: number;
  note: number;
  moyPromo: number;
}

interface GradesTableProps {
  grades: GradeItem[];
  onRowClick?: (moduleName: string) => void;
  onShowPreviousYearClick?: () => void;
}

export function GradesTable({ grades, onRowClick, onShowPreviousYearClick }: GradesTableProps) {
  return (
    <div className="bg-white border border-neutral-gray-200 rounded-2xl overflow-hidden shadow-3xs">
      <div className="px-5 py-4 border-b border-neutral-gray-200/50 flex justify-between items-center bg-white">
        <h3 className="text-xs md:text-sm font-black text-[#291715] uppercase tracking-wider">Détail des modules</h3>
        <div className="flex gap-1.5">
          <span className="bg-[#FAF8F6] border border-neutral-200/40 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-neutral-600">Semestre 2</span>
          <span className="bg-[#FAF8F6] border border-neutral-200/40 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-neutral-600">Année 2023-24</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/55 border-b border-neutral-200/45">
              <th className="px-4 py-3 text-[9px] font-black text-neutral-400 uppercase tracking-wider">Module</th>
              <th className="px-4 py-3 text-[9px] font-black text-neutral-400 uppercase tracking-wider">Crédits</th>
              <th className="px-4 py-3 text-[9px] font-black text-neutral-400 uppercase tracking-wider">Note Finale</th>
              <th className="px-4 py-3 text-[9px] font-black text-neutral-400 uppercase tracking-wider">Moy. Promo</th>
              <th className="px-4 py-3 text-[9px] font-black text-neutral-400 uppercase tracking-wider text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-gray-200/30">
            {grades.map((g) => (
              <tr 
                key={g.module} 
                onClick={() => onRowClick?.(g.module)}
                className="hover:bg-brand-red-light/10 transition-all cursor-pointer border-b border-neutral-gray-200/30 last:border-0"
              >
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#291715] text-[11px] md:text-xs leading-tight">{g.module}</span>
                    <span className="text-neutral-400 text-[10px] font-semibold mt-0.5">{g.prof}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-neutral-500 font-bold text-[10px] md:text-xs whitespace-nowrap">{g.ects} ECTS</td>
                <td className="px-4 py-3.5">
                  <span className="font-extrabold text-[#B3181C] text-[11px] md:text-xs">{g.note.toFixed(2)}</span>
                </td>
                <td className="px-4 py-3.5 text-neutral-400 font-bold text-[10px] md:text-xs">{g.moyPromo.toFixed(2)}</td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  {g.note >= 10 ? (
                    <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                      Validé
                    </span>
                  ) : (
                    <span className="bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/25 px-2 py-0.5 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                      Rattrapage
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-neutral-50/50 border-t border-neutral-gray-200/40 text-center">
        <button 
          onClick={onShowPreviousYearClick}
          className="text-[#B3181C] font-black text-[10px] tracking-wide uppercase hover:underline active:opacity-80 transition-opacity cursor-pointer"
        >
          [ Voir les notes de l'année précédente ]
        </button>
      </div>
    </div>
  );
}
