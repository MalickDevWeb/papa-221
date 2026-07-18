import React, { useState } from 'react';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';
import { getAdmissionsDb, saveAdmissionsDb, addAuditLog } from './admissionsDb';

interface Props {
  candidate: ExtendedCandidate;
  onUpdate: (updated: ExtendedCandidate) => void;
}

export function CandidatePaymentsTab({ candidate, onUpdate }: Props) {
  const [processing, setProcessing] = useState(false);

  const handlePayRegistration = () => {
    setProcessing(true);
    setTimeout(() => {
      const db = getAdmissionsDb();
      const updatedCandidates = db.candidates.map(c => {
        if (c.id === candidate.id) {
          const updated: ExtendedCandidate = { ...c, registrationFeePaid: true };
          return updated;
        }
        return c;
      });

      saveAdmissionsDb({ candidates: updatedCandidates });
      const current = updatedCandidates.find(c => c.id === candidate.id);
      if (current) {
        addAuditLog(candidate.id, 'Règlement des frais d\'études de dossier (Simulation)', candidate.name);
        onUpdate(current);
      }
      setProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-neutral-600" id="candidate-payments-tab">
      <div>
        <h4 className="font-extrabold text-[#1E293B]">Gestion financière de la Candidature</h4>
        <p className="text-[10px] text-neutral-400">Consultez l'historique et effectuez vos versements sécurisés.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment details */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Frais de Dossier</span>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Montant de base :</span>
              <span className="font-extrabold text-[#1E293B]">50,000 FCFA</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-neutral-500">Statut de transaction :</span>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                candidate.registrationFeePaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {candidate.registrationFeePaid ? 'Payé' : 'Non Payé'}
              </span>
            </div>
          </div>

          {!candidate.registrationFeePaid && (
            <button
              disabled={processing}
              onClick={handlePayRegistration}
              className="w-full mt-3 h-10 bg-[#B3181C] hover:bg-[#8F1316] text-white rounded-xl uppercase font-black tracking-wider text-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {processing ? 'Traitement en cours...' : 'Régler les 50,000 FCFA'}
            </button>
          )}
        </div>

        {/* Tranche 1 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Frais de Scolarité : Tranche 1</span>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Montant :</span>
              <span className="font-extrabold text-[#1E293B]">450,000 FCFA</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-neutral-500">Versement exigé :</span>
              <span className="text-neutral-500 font-bold">À l'admission définitive</span>
            </div>
            <p className="text-[9.5px] leading-relaxed text-neutral-400 font-semibold">
              ⚠️ Le paiement de la première tranche se débloquera une fois que votre dossier sera définitivement admis par la scolarité générale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
