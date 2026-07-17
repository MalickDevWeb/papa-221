import React from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

export function TabActivities({ selectedStudent, erpData }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-activities">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-sm">groups</span>
            Clubs & Associations
          </h4>
          <p className="text-neutral-800 leading-relaxed font-bold bg-white p-2.5 rounded-xl border border-neutral-150">
            {finalErpData.extra.clubs}
          </p>
        </div>

        <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-sm">work</span>
            Stage & Mémoire Professionnel
          </h4>
          <div className="space-y-2 bg-white p-2.5 rounded-xl border border-neutral-150">
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase">Sujet de Mémoire</p>
              <p className="text-neutral-800 font-extrabold mt-0.5">{finalErpData.extra.memoire}</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase">Expérience en entreprise</p>
              <p className="text-neutral-800 font-bold mt-0.5">{finalErpData.extra.stage}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-sm">assignment_turned_in</span>
            Projets & Certifications
          </h4>
          <div className="space-y-2 bg-white p-2.5 rounded-xl border border-neutral-150">
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase">Projet Majeur de cycle</p>
              <p className="text-neutral-800 font-extrabold mt-0.5">{finalErpData.extra.projets}</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase">Certifications Validées</p>
              <p className="text-emerald-700 font-black mt-0.5">{finalErpData.extra.certifications}</p>
            </div>
          </div>
        </div>

        <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-sm">library_books</span>
            Services Annexes (Bibliothèque & RDV)
          </h4>
          <div className="space-y-2 bg-white p-2.5 rounded-xl border border-neutral-150">
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase">Emprunts en cours</p>
              <p className="text-neutral-800 font-bold mt-0.5">{finalErpData.extra.bibliotheque}</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase">Prochain Rendez-vous Pédagogique</p>
              <p className="text-neutral-800 font-bold mt-0.5">{finalErpData.extra.rendezVous}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
