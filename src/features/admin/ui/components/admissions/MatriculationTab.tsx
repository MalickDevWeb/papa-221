import React, { useState } from 'react';
import { Candidate } from '../../../domain/AdmissionsModels';

interface Props {
  candidates: Candidate[];
  onEnroll: (candidate: Candidate) => void;
  onTogglePayment: (id: string) => void;
}

export function MatriculationTab({ candidates, onEnroll, onTogglePayment }: Props) {
  const admitted = candidates.filter((c) => c.step === 'admitted');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const handleEnrollClick = (c: Candidate) => {
    setEnrollingId(c.id);
    setTimeout(() => {
      onEnroll(c);
      setEnrollingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4" id="matriculation-tab-root">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Paiements d'Entrée & Matriculation des Candidats</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">
          Finalisez l'inscription des admis ayant réglé leur première tranche pour les basculer dans l'annuaire scolaire.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF8F6] text-[10px] font-black text-neutral-400 uppercase border-b border-neutral-200">
              <th className="px-5 py-3">Candidat Admis</th>
              <th className="px-5 py-3">Filière Cible</th>
              <th className="px-5 py-3">Dossier Certifié</th>
              <th className="px-5 py-3">Paiement Tranche 1</th>
              <th className="px-5 py-3 text-right">Matriculation d'Office</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
            {admitted.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-neutral-300 uppercase tracking-wider text-[10px] font-black">
                  Aucun candidat prêt pour la matriculation
                </td>
              </tr>
            ) : (
              admitted.map((c) => {
                const isReady = c.registrationFeePaid && c.docs.diploma && c.docs.idCard;
                const isProcessing = enrollingId === c.id;

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-[#1E293B] font-extrabold">{c.name}</div>
                      <div className="text-[9px] text-neutral-400 font-semibold">{c.id}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-500 uppercase">{c.course}</td>
                    <td className="px-5 py-4">
                      <span className="text-emerald-600 text-[10px] font-black flex items-center gap-1">
                        <span translate="no" className="material-symbols-outlined text-xs">verified</span>
                        <span>Dossier Conforme</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onTogglePayment(c.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                          c.registrationFeePaid
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {c.registrationFeePaid ? 'Payé (Tranche 1)' : 'Non Payé (Encaisser)'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleEnrollClick(c)}
                        disabled={!isReady || isProcessing}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${
                          isReady
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90'
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                        }`}
                        title={isReady ? 'Générer Matricule & Intégrer' : 'Régler la tranche 1 d\'abord'}
                      >
                        <span translate="no" className={`material-symbols-outlined text-sm ${isProcessing ? 'animate-spin' : ''}`}>
                          {isProcessing ? 'progress_activity' : 'qr_code_2'}
                        </span>
                        <span>{isProcessing ? 'Matriculation...' : 'Activer & Matriculer'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
