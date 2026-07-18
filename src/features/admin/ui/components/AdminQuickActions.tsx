import React, { useState } from 'react';
import { AdminManageUsersModal } from './AdminManageUsersModal';
import { AdminEditPlanningModal } from './AdminEditPlanningModal';
import { AdminAlertsModal } from './AdminAlertsModal';
import { AdminPaymentsModal } from './AdminPaymentsModal';
import { AdminCandidaturesModal } from './AdminCandidaturesModal';
import type { AdminStudent, AdminProfessor, AdminPromotion } from '../../domain/AdminModels';

interface AdminQuickActionsProps {
  students: AdminStudent[];
  professors: AdminProfessor[];
  promotions: AdminPromotion[];
  onAddStudent: (stud: { name: string; matricule: string; promotion_id: string }) => Promise<boolean>;
  onDeleteStudent: (id: string) => Promise<boolean>;
  onAddProf: (prof: { name: string; email: string }) => Promise<boolean>;
  onDeleteProf: (id: string) => Promise<boolean>;
  onUpdatePayment: (id: string, status: string) => Promise<boolean>;
  onRefreshData: () => Promise<void>;
}

export function AdminQuickActions({
  students, professors, promotions,
  onAddStudent, onDeleteStudent, onAddProf, onDeleteProf, onUpdatePayment, onRefreshData
}: AdminQuickActionsProps) {
  const [modal, setModal] = useState<'users' | 'planning' | 'alerts' | 'payments' | 'candidatures' | null>(null);

  return (
    <section className="mb-8">
      <h3 className="text-lg font-black text-[#291715] mb-4">Actions Rapides Administration</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <button onClick={() => setModal('users')} className="flex flex-col items-center justify-center p-4 bg-white border border-[#E2DCDA] rounded-xl hover:bg-[#FFF5F5] transition-colors active:scale-95 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center mb-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] font-bold">group</span>
          </div>
          <span className="text-[10px] font-bold text-center uppercase text-[#291715]">Membres</span>
        </button>

        <button onClick={() => setModal('planning')} className="flex flex-col items-center justify-center p-4 bg-white border border-[#E2DCDA] rounded-xl hover:bg-[#FFF5F5] transition-colors active:scale-95 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center mb-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] font-bold">calendar_month</span>
          </div>
          <span className="text-[10px] font-bold text-center uppercase text-[#291715]">Planning</span>
        </button>

        <button onClick={() => setModal('payments')} className="flex flex-col items-center justify-center p-4 bg-white border border-[#E2DCDA] rounded-xl hover:bg-[#FFF5F5] transition-colors active:scale-95 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center mb-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] font-bold">credit_card</span>
          </div>
          <span className="text-[10px] font-bold text-center uppercase text-[#291715]">Paiements</span>
        </button>

        <button onClick={() => setModal('candidatures')} className="flex flex-col items-center justify-center p-4 bg-white border border-[#E2DCDA] rounded-xl hover:bg-[#FFF5F5] transition-colors active:scale-95 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center mb-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] font-bold">how_to_reg</span>
          </div>
          <span className="text-[10px] font-bold text-center uppercase text-[#291715]">Candidatures</span>
        </button>

        <button onClick={() => setModal('alerts')} className="flex flex-col items-center justify-center p-4 bg-white border border-[#E2DCDA] rounded-xl hover:bg-[#FFF5F5] transition-colors active:scale-95 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F5] flex items-center justify-center mb-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] font-bold">campaign</span>
          </div>
          <span className="text-[10px] font-bold text-center uppercase text-[#291715]">Diffusion</span>
        </button>
      </div>

      {modal === 'users' && (
        <AdminManageUsersModal onClose={() => setModal(null)} students={students} professors={professors} promotions={promotions} onAddStudent={onAddStudent} onDeleteStudent={onDeleteStudent} onAddProf={onAddProf} onDeleteProf={onDeleteProf} onRefreshData={onRefreshData} />
      )}
      {modal === 'planning' && <AdminEditPlanningModal onClose={() => setModal(null)} />}
      {modal === 'alerts' && <AdminAlertsModal onClose={() => setModal(null)} />}
      {modal === 'payments' && (
        <AdminPaymentsModal onClose={() => setModal(null)} students={students} promotions={promotions} onUpdatePayment={onUpdatePayment} />
      )}
      {modal === 'candidatures' && (
        <AdminCandidaturesModal onClose={() => setModal(null)} onRefreshData={onRefreshData} />
      )}
    </section>
  );
}
