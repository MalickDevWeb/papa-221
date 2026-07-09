import React, { useState } from 'react';
import type { AdminStudent, AdminProfessor, AdminPromotion } from '../../domain/AdminModels';
import { AdminExcelImport } from './AdminExcelImport';
import { AdminStudentTracker } from './AdminStudentTracker';
import { AdminClassFiliereManager } from './AdminClassFiliereManager';
import { AdminPersonnelManager } from './AdminPersonnelManager';

interface AdminManageUsersModalProps {
  onClose: () => void;
  students: AdminStudent[];
  professors: AdminProfessor[];
  promotions: AdminPromotion[];
  onAddStudent: (stud: { name: string; matricule: string; promotion_id: string }) => Promise<boolean>;
  onDeleteStudent: (id: string) => Promise<boolean>;
  onAddProf: (prof: { name: string; email: string }) => Promise<boolean>;
  onDeleteProf: (id: string) => Promise<boolean>;
  onRefreshData: () => Promise<void>;
}

export function AdminManageUsersModal({
  onClose, students, professors, promotions, onDeleteStudent, onRefreshData
}: AdminManageUsersModalProps) {
  const [tab, setTab] = useState<'tracker' | 'import' | 'structure' | 'personnel' | 'list'>('list');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="admin-users-modal">
      <div className="bg-[#FAF8F6] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-[#E2DCDA]">
        <div className="p-4 bg-white border-b border-[#E2DCDA] flex justify-between items-center">
          <div>
            <h3 className="font-black text-sm text-[#291715] uppercase tracking-wide">Panneau d'Organisation & Personnel</h3>
            <p className="text-[10px] text-[#8E7977] font-semibold">Classes, filières, enseignants et dossiers scolaires</p>
          </div>
          <button onClick={onClose} className="text-[#8E7977] hover:text-[#B3181C] font-black text-xs uppercase cursor-pointer bg-[#FAF8F6] hover:bg-[#FFF5F5] px-2 py-1 rounded-md border border-[#E2DCDA]/50 transition-all">[ Fermer ]</button>
        </div>

        <div className="flex bg-[#E2DCDA]/30 p-1 border-b border-[#E2DCDA] overflow-x-auto gap-1">
          {([
            ['list', 'Étudiants'],
            ['tracker', 'Suivi Dossier'],
            ['import', 'Import Excel'],
            ['structure', 'Classes & Filières'],
            ['personnel', 'Personnel & Staff']
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-1.5 px-2 text-[10px] font-black uppercase rounded-lg transition-all whitespace-nowrap ${tab === k ? 'bg-[#B3181C] text-white shadow-xs' : 'text-[#8E7977] hover:bg-white/50'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {tab === 'list' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-between items-center bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA]/60">
                <span className="font-extrabold text-[#291715] text-[11px] uppercase">Roster de l'Établissement</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#FFF5F5] text-[#B3181C] border border-[#FFD1D1]">
                  {students.length} Élèves inscrits
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {students.map(s => (
                  <div key={s.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#E2DCDA] hover:shadow-xs transition-shadow">
                    <div>
                      <p className="text-xs font-bold text-[#291715]">{s.name}</p>
                      <p className="text-[9px] text-[#8E7977] font-bold">Matricule : {s.matricule} • {promotions.find(p => p.id === s.promotion_id)?.name || 'Classe'}</p>
                      <p className="text-[9px] font-semibold text-[#B3181C]">Moyenne : {s.average || 'N/A'}/20</p>
                    </div>
                    <button onClick={async () => { if (confirm(`Supprimer ${s.name} ?`)) { await onDeleteStudent(s.id); onRefreshData(); } }} className="text-[9px] text-red-600 font-extrabold hover:underline uppercase bg-[#FFF5F5] px-2 py-1 rounded-md border border-[#FFD1D1]">Retirer</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'tracker' && (
            <AdminStudentTracker students={students as any} onUpdate={onRefreshData} />
          )}

          {tab === 'import' && (
            <AdminExcelImport promotions={promotions} onImportSuccess={onRefreshData} />
          )}

          {tab === 'structure' && (
            <AdminClassFiliereManager promotions={promotions} professors={professors} onCreated={onRefreshData} />
          )}

          {tab === 'personnel' && (
            <AdminPersonnelManager onUpdate={onRefreshData} />
          )}
        </div>
      </div>
    </div>
  );
}
