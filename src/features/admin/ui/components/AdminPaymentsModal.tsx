import React, { useState } from 'react';
import type { AdminStudent, AdminPromotion } from '../../domain/AdminModels';

interface AdminPaymentsModalProps {
  onClose: () => void;
  students: AdminStudent[];
  promotions: AdminPromotion[];
  onUpdatePayment: (id: string, status: string) => Promise<boolean>;
}

export function AdminPaymentsModal({ onClose, students, promotions, onUpdatePayment }: AdminPaymentsModalProps) {
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggle = async (studentId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'Paiement en retard' ? 'Scolarité à jour' : 'Paiement en retard';
    setUpdatingId(studentId);
    await onUpdatePayment(studentId, nextStatus);
    setUpdatingId(null);
  };

  const getPromoName = (promoId: string) => promotions.find(p => p.id === promoId)?.name || 'Inconnue';

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.matricule.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF8F6] w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] border border-[#E2DCDA]">
        <div className="p-4 bg-white border-b border-[#E2DCDA] flex justify-between items-center">
          <div>
            <h3 className="font-black text-sm text-[#291715]">Gestion de la Scolarité & Paiements</h3>
            <p className="text-[10px] text-[#8E7977] font-semibold uppercase">École 221 • Contrôle Financier</p>
          </div>
          <button onClick={onClose} className="text-[#8E7977] hover:text-[#B3181C] text-xs font-bold">[ Fermer ]</button>
        </div>

        <div className="p-3 bg-white border-b border-[#E2DCDA]">
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Rechercher par nom ou matricule..."
            className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl p-2 text-xs outline-none focus:border-[#B3181C]"
          />
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filteredStudents.length === 0 ? (
            <p className="text-center text-xs text-[#8E7977] py-6">Aucun étudiant trouvé.</p>
          ) : (
            filteredStudents.map(student => {
              const isOk = student.statutFrais !== 'Paiement en retard';
              return (
                <div key={student.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-[#E2DCDA] shadow-sm hover:border-[#B3181C]/20 transition-all">
                  <div>
                    <h4 className="text-xs font-bold text-[#291715]">{student.name}</h4>
                    <p className="text-[10px] text-[#8E7977] font-medium">
                      Matricule: {student.matricule} • {getPromoName(student.promotion_id)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle(student.id, student.statutFrais)}
                    disabled={updatingId === student.id}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${isOk ? 'bg-[#EAF7EE] text-[#1E5E3A] border border-[#D0EBD9] hover:bg-[#D9F2E2]' : 'bg-[#FFF5F5] text-[#B3181C] border border-[#FFD1D1] hover:bg-[#FFE6E6]'}`}
                  >
                    {updatingId === student.id ? 'Mise à jour...' : isOk ? 'À jour' : 'En retard'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
