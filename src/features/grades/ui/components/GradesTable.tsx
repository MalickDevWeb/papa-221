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
    <div className="bg-white border border-neutral-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neutral-gray-200 flex justify-between items-center bg-white">
        <h3 className="font-title-lg text-lg font-bold text-on-surface">Détail des modules</h3>
        <div className="flex gap-2">
          <span className="bg-surface-container px-3 py-1 rounded text-label-md text-secondary font-bold">Semestre 2</span>
          <span className="bg-surface-container px-3 py-1 rounded text-label-md text-secondary font-bold">Année 2023-24</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-neutral-gray-200">
              <th className="px-6 py-4 font-label-md text-label-md opacity-50 uppercase tracking-wider">Module</th>
              <th className="px-6 py-4 font-label-md text-label-md opacity-50 uppercase tracking-wider">Crédits</th>
              <th className="px-6 py-4 font-label-md text-label-md opacity-50 uppercase tracking-wider">Note Finale</th>
              <th className="px-6 py-4 font-label-md text-label-md opacity-50 uppercase tracking-wider">Moy. Promo</th>
              <th className="px-6 py-4 font-label-md text-label-md opacity-50 uppercase tracking-wider text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-gray-200">
            {grades.map((g) => (
              <tr 
                key={g.module} 
                onClick={() => onRowClick?.(g.module)}
                className="hover:bg-brand-red-light/40 transition-all cursor-pointer border-b border-neutral-gray-100 last:border-0"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-xs md:text-sm">{g.module}</span>
                    <span className="text-secondary text-label-md">{g.prof}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface font-bold text-xs md:text-sm">{g.ects} ECTS</td>
                <td className="px-6 py-4">
                  <span className="font-extrabold text-primary text-xs md:text-sm">{g.note.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 text-secondary font-bold text-xs md:text-sm">{g.moyPromo.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  {g.note >= 10 ? (
                    <span className="bg-green-50 text-success-green border border-success-green/25 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase">
                      Validé
                    </span>
                  ) : (
                    <span className="bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/25 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase">
                      Rattrapage
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-surface-container-low border-t border-neutral-gray-200 text-center">
        <button 
          onClick={onShowPreviousYearClick}
          className="text-primary font-bold font-label-md text-label-md hover:underline active:opacity-80 transition-opacity cursor-pointer"
        >
          [ Voir les notes de l'année précédente ]
        </button>
      </div>
    </div>
  );
}
