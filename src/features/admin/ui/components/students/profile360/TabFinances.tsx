import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';
import { CoffreSubTab } from '../CoffreSubTab';
import { exportToCSV } from './utils/ExportUtils';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

export function TabFinances({ selectedStudent, erpData }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);
  const [financeTab, setFinanceTab] = useState<'fees' | 'vault'>('fees');

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-finances">
      <div className="flex border-b border-neutral-100 gap-2 pb-2">
        <button
          onClick={() => setFinanceTab('fees')}
          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
            financeTab === 'fees' ? 'bg-[#B3181C] text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          Frais & Scolarité
        </button>
        <button
          onClick={() => setFinanceTab('vault')}
          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
            financeTab === 'vault' ? 'bg-[#B3181C] text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          Coffre-fort Numérique
        </button>
      </div>

      {financeTab === 'fees' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-neutral-200/60 p-3 bg-emerald-50/20 rounded-2xl">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase">Statut Financier Général</span>
              <span className="text-emerald-700 font-black text-xs uppercase flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                En Règle (Scolarité soldée)
              </span>
            </div>
            <div className="border border-neutral-200/60 p-3 bg-neutral-50/50 rounded-2xl">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase">Bourses & Allocations</span>
              <span className="text-[#1E293B] font-black text-xs mt-1 block">{finalErpData.extra.bourses}</span>
            </div>
          </div>
 
          <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white">
            <div className="bg-neutral-50 border-b border-neutral-100 px-3 py-2.5 flex items-center justify-between">
              <span className="text-[#1E293B] font-extrabold text-[11px] uppercase tracking-wider">Historique de Facturation & Reçus</span>
              <button
                onClick={() => exportToCSV(finalErpData.payments, `Facturation_${selectedStudent.name}`)}
                className="px-2 py-1 border border-neutral-200 hover:bg-white text-neutral-700 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <span translate="no" className="material-symbols-outlined text-xs">download</span>
                <span>Exporter Factures</span>
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50 text-[9px] text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  <th className="p-2.5">Désignation</th>
                  <th className="p-2.5 text-right">Montant</th>
                  <th className="p-2.5">Date & Moyen</th>
                  <th className="p-2.5">Reçu N°</th>
                </tr>
              </thead>
              <tbody>
                {finalErpData.payments.map((p, idx) => (
                  <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 text-[11px]">
                    <td className="p-2.5">
                      <p className="font-extrabold text-[#1E293B]">{p.label}</p>
                      <p className="text-[9px] text-emerald-800 font-black uppercase mt-0.5">{p.status}</p>
                    </td>
                    <td className="p-2.5 text-right font-black text-neutral-800">{p.amount}</td>
                    <td className="p-2.5 font-bold">
                      <p className="text-neutral-700">{p.date}</p>
                      <p className="text-[9px] text-neutral-400">{p.method}</p>
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-neutral-500 font-bold">{p.receiptNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {financeTab === 'vault' && (
        <div className="border border-neutral-100 p-4 rounded-2xl bg-white space-y-3 shadow-inner">
          <CoffreSubTab studentId={selectedStudent.id} />
        </div>
      )}
    </div>
  );
}
