import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

export function TabAcademic({ selectedStudent, erpData }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);
  const [selectedYear, setSelectedYear] = useState<'L1' | 'L2' | 'L3'>('L3');

  const getYearSummary = () => {
    switch (selectedYear) {
      case 'L1':
        return { promo: 'Promotion 2023-2024', gpa: '16.1/20', ects: '60 / 60 ECTS', status: 'Admis(e) avec félicitations' };
      case 'L2':
        return { promo: 'Promotion 2024-2025', gpa: '16.3/20', ects: '60 / 60 ECTS', status: 'Admis(e) en L3' };
      case 'L3':
      default:
        return { promo: 'Promotion 2025-2026 (Courante)', gpa: selectedStudent.gpa, ects: '30 / 60 ECTS (S1 validé)', status: 'Cycle en cours' };
    }
  };

  const yearSummary = getYearSummary();

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-academic">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-2.5">
        {(['L1', 'L2', 'L3'] as const).map((yr) => (
          <button
            key={yr}
            onClick={() => setSelectedYear(yr)}
            className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
              selectedYear === yr
                ? 'bg-[#B3181C] text-white'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            Niveau {yr}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-neutral-200/60 p-3.5 rounded-2xl bg-neutral-50/50">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Année Académique</p>
          <p className="text-neutral-800 font-extrabold text-sm mt-0.5">{yearSummary.promo}</p>
        </div>
        <div className="border border-neutral-200/60 p-3.5 rounded-2xl bg-neutral-50/50">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Moyenne Générale</p>
          <p className="text-[#B3181C] font-black text-sm mt-0.5">{yearSummary.gpa}</p>
        </div>
        <div className="border border-neutral-200/60 p-3.5 rounded-2xl bg-neutral-50/50">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Crédits ECTS validés</p>
          <p className="text-emerald-700 font-black text-sm mt-0.5">{yearSummary.ects}</p>
        </div>
      </div>

      <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white">
        <div className="bg-neutral-50 border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-sm text-[#B3181C]">view_list</span>
            Programme d'Études & Syllabus Courant ({selectedYear})
          </h4>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase">
            {yearSummary.status}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                <th className="p-3 font-bold">Unité d'Enseignement (UE)</th>
                <th className="p-3 font-bold">Volume Horaire</th>
                <th className="p-3 font-bold">Professeur</th>
                <th className="p-3 font-bold text-center">Validation</th>
              </tr>
            </thead>
            <tbody>
              {finalErpData.ueList.map((item, idx) => (
                <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors text-[11px]">
                  <td className="p-3">
                    <p className="font-extrabold text-[#1E293B]">{item.module}</p>
                    <p className="text-[10px] text-neutral-400 font-bold">{item.ue} (Coef. {item.coefficient})</p>
                  </td>
                  <td className="p-3 font-bold text-neutral-600">45 Heures CM/TD</td>
                  <td className="p-3 font-bold text-neutral-800">{item.teacher}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-extrabold">
                      ACQUIS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
