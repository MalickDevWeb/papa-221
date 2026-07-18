import React from 'react';
import { ExtendedCandidate } from '../../../domain/AdmissionsExtendedModels';

interface Props {
  candidate: ExtendedCandidate;
}

export function CandidateAlertsPanel({ candidate }: Props) {
  const isReinscription = candidate.type === 'REINSCRIPTION';
  const unpaid = candidate.details?.unpaidDues || 0;
  const sanctions = candidate.details?.sanctionsCount || 0;
  const passedPreviousYear = candidate.details?.previousYearValidated ?? true;

  return (
    <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAF8F6] space-y-3 text-xs font-bold text-neutral-600" id="candidate-alerts-panel">
      <div className="border-b border-neutral-200 pb-1.5 flex justify-between items-center">
        <span className="font-extrabold text-[#1E293B] uppercase text-[10px] tracking-wide">Audit de Statut Scolaire</span>
        <span className="text-[9px] px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded font-black uppercase">Contrôle Auto</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Année Précédente Validée (N-1)</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${passedPreviousYear ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            {passedPreviousYear ? '✓ OUI (Validée)' : '✗ NON (Ajourné)'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Arriérés de Frais (Dettes)</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${unpaid === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            {unpaid === 0 ? 'Ajouré (0 FCFA)' : `${unpaid.toLocaleString()} FCFA`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Sanctions / Conseil de Discipline</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${sanctions === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            {sanctions === 0 ? 'Aucune' : `${sanctions} active(s)`}
          </span>
        </div>

        {isReinscription && (
          <div className="pt-2 border-t border-neutral-200">
            {unpaid > 0 || sanctions > 0 || !passedPreviousYear ? (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 uppercase text-[9px]">
                  <span translate="no" className="material-symbols-outlined text-xs">warning</span>
                  <span>Alerte d'Éligibilité</span>
                </div>
                <p className="text-[10px] font-semibold">
                  Le dossier de réinscription automatique de ce candidat comporte des éléments bloquants. Veuillez régulariser les arriérés administratifs avant validation définitive.
                </p>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 uppercase text-[9px]">
                  <span translate="no" className="material-symbols-outlined text-xs">check_circle</span>
                  <span>Conforme</span>
                </div>
                <p className="text-[10px] font-semibold">
                  Tous les feux sont au vert ! Aucun arriéré de frais, aucune sanction disciplinaire enregistrée, et l'année académique précédente est validée.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
