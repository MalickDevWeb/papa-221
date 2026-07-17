import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';
import { GradesChart, PerformanceReport } from './GradesSummary';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

export function TabGrades({ selectedStudent, erpData }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);
  const [search, setSearch] = useState('');

  const filteredGrades = finalErpData.ueList.filter((g: any) =>
    g.module.toLowerCase().includes(search.toLowerCase()) ||
    g.ue.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = finalErpData.ueList.map((g: any) => ({
    name: g.module.substring(0, 15) + '...',
    Note: g.grade,
    MoyenneClasse: 14.5
  }));

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-grades">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GradesChart chartData={chartData} />

        <PerformanceReport
          gpa={selectedStudent.gpa}
          filteredGrades={filteredGrades}
          studentName={selectedStudent.name}
        />
      </div>

      <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white">
        <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-neutral-400 text-sm">search</span>
          <input type="text" placeholder="Rechercher une matière ou UE..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-xs text-neutral-800 placeholder-neutral-400 font-bold flex-grow" />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50/50 text-[9px] text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
              <th className="p-2.5">Module / Matière</th>
              <th className="p-2.5 text-center">Note</th>
              <th className="p-2.5 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((g: any, idx: number) => (
              <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 text-[11px]">
                <td className="p-2.5">
                  <p className="font-extrabold text-neutral-800">{g.module}</p>
                  <p className="text-[10px] text-neutral-400 font-bold">{g.ue}</p>
                </td>
                <td className="p-2.5 text-center font-black text-[#B3181C]">{g.grade}/20</td>
                <td className="p-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-black">{g.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
