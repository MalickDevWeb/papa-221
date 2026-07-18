import React from 'react';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';

interface Props {
  candidate: ExtendedCandidate;
}

export function CandidateStatusTab({ candidate }: Props) {
  const steps = [
    { label: 'Dossier Créé', done: true, current: false },
    { label: 'Vérification Administrative', done: candidate.step !== 'new', current: candidate.step === 'new' },
    { label: 'Paiement Étude', done: candidate.registrationFeePaid, current: false },
    { label: 'Décision d\'Admission', done: candidate.step === 'admitted', current: candidate.step === 'docs' }
  ];

  const getStatusColor = () => {
    if (candidate.step === 'admitted') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (candidate.step === 'rejected') return 'bg-rose-50 text-rose-800 border-rose-200';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  const getStatusLabel = () => {
    if (candidate.step === 'admitted') return 'Félicitations ! Vous êtes ADMIS';
    if (candidate.step === 'rejected') return 'Dossier REFUSÉ ou en attente d\'Équivalences';
    return 'Dossier EN COURS DE TRAITEMENT';
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-neutral-600" id="candidate-status-tab-content">
      {/* Alert Header Banner */}
      <div className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${getStatusColor()}`}>
        <div>
          <h4 className="font-extrabold text-sm leading-tight uppercase">{getStatusLabel()}</h4>
          <p className="text-[10px] mt-1 font-semibold opacity-90">
            Candidat ID : <strong className="font-mono">{candidate.id}</strong> · Cursus : {candidate.course}
          </p>
        </div>
        {candidate.step === 'admitted' && (
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm animate-bounce inline-block text-center sm:text-left">
            Matricule en cours de génération
          </span>
        )}
      </div>

      {/* Progressive Step Line */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3">
        <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Progression Académique</span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 border-l-2 sm:border-l-0 sm:border-t-2 pl-3 sm:pl-0 sm:pt-3.5" style={{ borderColor: s.done ? '#B3181C' : '#E2DCDA' }}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                s.done ? 'bg-[#B3181C] text-white' : s.current ? 'bg-neutral-800 text-white animate-pulse' : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
              }`}>
                {s.done ? '✓' : idx + 1}
              </div>
              <div>
                <h5 className="font-extrabold text-[#1E293B] text-[11px] leading-tight">{s.label}</h5>
                <p className="text-[9px] text-neutral-400 font-semibold">{s.done ? 'Étape validée' : s.current ? 'Action requise' : 'À venir'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications timeline */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3">
        <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Dernières Notifications</span>
        {candidate.notifications && candidate.notifications.length > 0 ? (
          <div className="space-y-2.5">
            {candidate.notifications.map((n, i) => (
              <div key={i} className="flex gap-3 items-start p-2.5 bg-[#FAF8F6] border border-neutral-200 rounded-xl">
                <span translate="no" className="material-symbols-outlined text-xs text-[#B3181C] mt-0.5">notifications</span>
                <div className="flex-1">
                  <p className="text-neutral-600 font-bold leading-relaxed">{n.message}</p>
                  <span className="text-[8.5px] text-neutral-400 block mt-1 font-semibold">{new Date(n.sentAt).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-neutral-400 text-[10px]">Aucune notification récente.</div>
        )}
      </div>
    </div>
  );
}
