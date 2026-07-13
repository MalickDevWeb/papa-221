import React, { useState } from 'react';
import { StudentFinance, CLASSES_LIST } from '../../../domain/FinancesModels';
import { useDeviceStore } from '@/features/screenguard/hooks/useDeviceStore';
import { ClassSelectRow } from './ClassSelectRow';
import { MobileEcolagesCards } from './MobileEcolagesCards';

interface Props {
  students: StudentFinance[];
  onToggleStatus: (id: string) => void;
}

export function EcolagesTab({ students }: Props) {
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[0]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { isMobile } = useDeviceStore();

  const filteredStudents = students.filter(s => {
    const cMatch = s.classe === selectedClass;
    const sMatch = filterStatus === 'ALL' || s.status === filterStatus;
    return cMatch && sMatch;
  });

  return (
    <div className="space-y-4" id="ecolages-tab-root">
      <ClassSelectRow
        selectedClass={selectedClass}
        onSelectClass={setSelectedClass}
        students={students}
      />

      <div className="bg-transparent sm:bg-white border-0 sm:border border-neutral-200 rounded-2xl p-0 sm:p-4 sm:shadow-xs space-y-3 w-full mx-auto">
        {/* DataGrid Header with Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
          <span className="text-[11px] font-black uppercase text-[#1E293B] tracking-wider">État financier - {selectedClass}</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold bg-white focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">Afficher tout</option>
            <option value="En Règle">En Règle</option>
            <option value="En Avance">En Avance</option>
            <option value="En Retard">En Retard / Impayé</option>
          </select>
        </div>

        {isMobile ? (
          <MobileEcolagesCards students={filteredStudents} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F6] text-[9px] font-black text-neutral-400 uppercase border-b border-neutral-200">
                  <th className="px-4 py-2.5">Nom Complet</th>
                  <th className="px-4 py-2.5">Matricule</th>
                  <th className="px-4 py-2.5">Total Versé</th>
                  <th className="px-4 py-2.5">Arriérés / Dette</th>
                  <th className="px-4 py-2.5">Santé Financière</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-neutral-300 font-black text-[10px] uppercase">Aucun élève trouvé</td>
                  </tr>
                ) : (
                  filteredStudents.map(s => (
                    <tr key={s.id} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3 text-[#1E293B] font-extrabold">{s.name}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-neutral-400">{s.id}</td>
                      <td className="px-4 py-3 font-mono text-[#1E293B]">{s.paid.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3">
                        {s.debt > 0 ? (
                          <span className="font-mono text-rose-600 font-black">{s.debt.toLocaleString()} FCFA</span>
                        ) : (
                          <span className="text-neutral-400 font-semibold">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          s.status === 'En Règle' ? 'bg-emerald-50 text-emerald-700' :
                          s.status === 'En Avance' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
