import React from 'react';
import { Student } from '../../../../domain/StudentModels';
import { DiagnosticIaPanel } from '../DiagnosticIaPanel';

interface Props {
  selectedStudent: Student;
}

export function TabAI({ selectedStudent }: Props) {
  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-ai">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-neutral-100 p-3 bg-indigo-50/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider">Score Académique</p>
            <p className="text-indigo-700 font-black text-base mt-0.5">94 / 100</p>
          </div>
          <span translate="no" className="material-symbols-outlined text-indigo-600 text-xl">insights</span>
        </div>

        <div className="border border-neutral-100 p-3 bg-emerald-50/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Probabilité Réussite</p>
            <p className="text-emerald-700 font-black text-base mt-0.5">98%</p>
          </div>
          <span translate="no" className="material-symbols-outlined text-emerald-600 text-xl">military_tech</span>
        </div>

        <div className="border border-neutral-100 p-3 bg-rose-50/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-rose-800 font-bold uppercase tracking-wider">Score de Risque</p>
            <p className="text-rose-700 font-black text-base mt-0.5">2% (Très Faible)</p>
          </div>
          <span translate="no" className="material-symbols-outlined text-rose-600 text-xl">warning</span>
        </div>
      </div>

      <div className="border border-neutral-100 p-3.5 bg-neutral-50/50 rounded-2xl space-y-1">
        <h5 className="font-extrabold text-[#1E293B] text-[10px] uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-sm">notifications_active</span>
          Alertes de Suivi & Risques Détectés
        </h5>
        <div className="bg-white p-2.5 rounded-xl border border-neutral-150 flex items-center gap-2.5">
          <span translate="no" className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
          <p className="text-[11px] text-neutral-700 font-bold leading-relaxed">
            Aucun risque académique majeur détecté. Progression constante. Légère baisse de participation notée en physique le 14 juillet en raison d'un retard justifié.
          </p>
        </div>
      </div>

      <div className="border border-neutral-100 p-4 rounded-2xl bg-white shadow-inner">
        <DiagnosticIaPanel studentId={selectedStudent.id} studentName={selectedStudent.name} />
      </div>
    </div>
  );
}
