import React from 'react';
import { StudentFinance } from '../../../domain/FinancesModels';

interface Props {
  students: StudentFinance[];
}

export function MobileEcolagesCards({ students }: Props) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400 font-extrabold text-[10px] uppercase">
        Aucun élève trouvé
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans" id="mobile-ecolages-cards">
      {students.map((s) => (
        <div key={s.id} className="p-3 border border-neutral-100 rounded-xl bg-neutral-50/50 flex flex-col gap-2 shadow-2xs w-full">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-extrabold text-[#1E293B] text-xs">{s.name}</div>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{s.id}</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
              s.status === 'En Règle' ? 'bg-emerald-50 text-emerald-700' :
              s.status === 'En Avance' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {s.status}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-t border-neutral-100 pt-2">
            <div>
              <span className="text-neutral-400 font-bold uppercase text-[8px] block">Versé</span>
              <span className="font-mono text-[#1E293B] font-extrabold">{s.paid.toLocaleString()} FCFA</span>
            </div>
            {s.debt > 0 && (
              <div className="text-right">
                <span className="text-neutral-400 font-bold uppercase text-[8px] block">Arriérés</span>
                <span className="font-mono text-rose-600 font-black">{s.debt.toLocaleString()} FCFA</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
