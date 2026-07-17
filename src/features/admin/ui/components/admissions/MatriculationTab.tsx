import React, { useState } from 'react';
import { ExtendedCandidate } from '../../../domain/AdmissionsExtendedModels';
import { CandidateAdmissionBadge } from './CandidateAdmissionBadge';

interface Props {
  candidates: ExtendedCandidate[];
  onEnroll: (candidate: ExtendedCandidate, matricule: string) => void;
  onTogglePayment: (id: string) => void;
}

export function MatriculationTab({ candidates, onEnroll, onTogglePayment }: Props) {
  const admitted = candidates.filter((c) => c.step === 'admitted');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [createdStudent, setCreatedStudent] = useState<{ name: string; matricule: string; credits: number; level: string } | null>(null);

  const handleEnrollClick = (c: ExtendedCandidate) => {
    setEnrollingId(c.id);
    const matricule = `MAT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const credits = c.equivalence?.validatedCredits || 0;
    const level = ['BAC'].includes(c.type) ? 'Licence 1' : ['L2', 'TRANSFER'].includes(c.type) ? 'Licence 2' : c.type === 'L3' ? 'Licence 3' : c.type === 'M1' ? 'Master 1' : c.type === 'M2' ? 'Master 2' : 'Doctorat';

    setTimeout(() => {
      onEnroll(c, matricule);
      setEnrollingId(null);
      setCreatedStudent({ name: c.name, matricule, credits, level });
    }, 1200);
  };

  return (
    <div className="space-y-4" id="matriculation-tab-root">
      <div className="pb-2 border-b border-neutral-100 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-[#1E293B]">Inscriptions Définitives & Transformation en Étudiant</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">
            Générez le matricule universitaire et créez le profil d'accès sans aucune ressaisie pour les dossiers admis en règle.
          </p>
        </div>
      </div>

      {createdStudent && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs font-bold text-emerald-800 space-y-2 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="uppercase text-[10px] font-black tracking-wider flex items-center gap-1">
              <span translate="no" className="material-symbols-outlined text-sm">verified_user</span>
              Étudiant Activé Avec Succès !
            </span>
            <button onClick={() => setCreatedStudent(null)} className="text-emerald-600 hover:text-emerald-900">Masquer</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/70 p-3 rounded-lg border border-emerald-100 text-[11px]">
            <div>Nom complet : <span className="text-[#1E293B] block font-black">{createdStudent.name}</span></div>
            <div>Matricule Unique : <span className="text-emerald-700 block font-black font-mono">{createdStudent.matricule}</span></div>
            <div>Niveau Affecté : <span className="text-[#1E293B] block font-black">{createdStudent.level}</span></div>
            <div>Crédits Reconnus : <span className="text-[#1E293B] block font-black">{createdStudent.credits} ECTS</span></div>
          </div>
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF8F6] text-[10px] font-black text-neutral-400 uppercase border-b border-neutral-200">
              <th className="px-5 py-3">Candidat Admis</th>
              <th className="px-5 py-3">Type & Cible</th>
              <th className="px-5 py-3">Audit Interne</th>
              <th className="px-5 py-3">Tranche 1 (Scolarité)</th>
              <th className="px-5 py-3 text-right">Activation Étudiant</th>
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
                    <td className="px-5 py-4 space-y-1">
                      <div className="text-neutral-500 uppercase">{c.course}</div>
                      <CandidateAdmissionBadge type={c.type} />
                    </td>
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
                        {c.registrationFeePaid ? 'Payé' : 'Non Payé'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleEnrollClick(c)}
                        disabled={!isReady || isProcessing}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer ${
                          isReady
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 shadow-md'
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                        }`}
                      >
                        <span>{isProcessing ? 'Génération...' : 'Matriculer'}</span>
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
