import React from 'react';
import { ExtendedCandidate, EquivalenceDetails } from '../../../domain/AdmissionsExtendedModels';
import { CandidateAdmissionBadge } from './CandidateAdmissionBadge';
import { EquivalencePanel } from './EquivalencePanel';
import { CandidateAlertsPanel } from './CandidateAlertsPanel';
import { NotificationPanel } from './NotificationPanel';

interface Props {
  candidate: ExtendedCandidate;
  onClose: () => void;
  onUpdateCandidate: (updated: ExtendedCandidate) => void;
}

export function CandidateDetailModal({ candidate, onClose, onUpdateCandidate }: Props) {
  const steps: { id: ExtendedCandidate['step']; label: string }[] = [
    { id: 'new', label: 'Nouveau' },
    { id: 'docs', label: 'Pièces Vérifiées' },
    { id: 'admitted', label: 'Admis d\'office' },
    { id: 'rejected', label: 'Rejeté' }
  ];

  const handleSendNotification = (type: string, message: string) => {
    const newNotif = { id: `not-${Date.now()}`, type, message, sentAt: new Date().toISOString() };
    onUpdateCandidate({ ...candidate, notifications: [newNotif, ...candidate.notifications] });
  };

  const handleSaveEquivalence = (eq: EquivalenceDetails) => {
    onUpdateCandidate({ ...candidate, equivalence: eq });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4 overflow-y-auto" id="candidate-detail-modal">
      <div className="bg-white rounded-2xl shadow-2xl p-5 border border-neutral-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4 text-xs font-bold text-[#4A5568]">
        <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-[#1E293B] text-base leading-none">{candidate.name}</h3>
              <CandidateAdmissionBadge type={candidate.type} />
            </div>
            <p className="text-[10px] text-neutral-400 font-extrabold tracking-wide uppercase">{candidate.id} — {candidate.email}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 cursor-pointer">
            <span translate="no" className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-neutral-50 p-3 rounded-xl space-y-1.5 border border-neutral-100">
              <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Fiche de Candidature Spécifique</span>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px]">
                <div>Filière Cible : <span className="text-[#1E293B] block font-extrabold">{candidate.course}</span></div>
                {candidate.details?.universityOfOrigin && (
                  <>
                    <div>Université d'Origine : <span className="text-[#1E293B] block">{candidate.details.universityOfOrigin}</span></div>
                    <div>Faculté : <span className="text-[#1E293B] block">{candidate.details.facultyOfOrigin}</span></div>
                    <div>Département : <span className="text-[#1E293B] block">{candidate.details.departmentOfOrigin}</span></div>
                    <div>Crédits Validés : <span className="text-[#1E293B] block">{candidate.details.validatedCredits}</span></div>
                    <div className="col-span-2">Motif Transfert : <span className="text-neutral-500 block italic">"{candidate.details.transferReason}"</span></div>
                  </>
                )}
                {candidate.details?.oldFiliere && (
                  <>
                    <div>Ancienne Filière : <span className="text-[#1E293B] block">{candidate.details.oldFiliere}</span></div>
                    <div>Nouvelle Filière : <span className="text-[#1E293B] block">{candidate.details.newFiliere}</span></div>
                    <div className="col-span-2">Motif Réorientation : <span className="text-neutral-500 block italic">"{candidate.details.reorientationReason}"</span></div>
                  </>
                )}
                {candidate.details?.passportNumber && (
                  <>
                    <div>N° Passeport : <span className="text-[#1E293B] block">{candidate.details.passportNumber}</span></div>
                    <div>Visa État : <span className="text-[#1E293B] block">{candidate.details.visaStatus}</span></div>
                  </>
                )}
                {candidate.details?.vaeExperienceYears !== undefined && (
                  <>
                    <div>Années d'Expérience : <span className="text-[#1E293B] block">{candidate.details.vaeExperienceYears} ans</span></div>
                    <div>Diplôme Target : <span className="text-[#1E293B] block">{candidate.details.vaeTargetDegree}</span></div>
                  </>
                )}
                {candidate.details?.exceptionalJustification && (
                  <>
                    <div>Autorisé par : <span className="text-[#1E293B] block">{candidate.details.exceptionalAuthority}</span></div>
                    <div>Réf. Décision : <span className="text-[#1E293B] block">{candidate.details.officialDecisionRef}</span></div>
                    <div className="col-span-2">Justification : <span className="text-neutral-500 block italic">"{candidate.details.exceptionalJustification}"</span></div>
                  </>
                )}
              </div>
            </div>

            <CandidateAlertsPanel candidate={candidate} />
          </div>

          <div className="space-y-3">
            {['TRANSFER', 'VAE', 'L2', 'L3', 'M1', 'M2', 'DOC'].includes(candidate.type) && (
              <EquivalencePanel initialEquivalence={candidate.equivalence} onSave={handleSaveEquivalence} />
            )}

            <NotificationPanel notifications={candidate.notifications} onSendNotification={handleSendNotification} />

            <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-xl space-y-1.5">
              <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Avancement du Dossier Académique (Workflow)</span>
              <div className="flex flex-wrap gap-1.5">
                {steps.map(step => (
                  <button
                    key={step.id}
                    onClick={() => onUpdateCandidate({ ...candidate, step: step.id })}
                    className={`px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-black border transition-all cursor-pointer ${
                      candidate.step === step.id
                        ? 'bg-[#B3181C] text-white border-[#B3181C]'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
