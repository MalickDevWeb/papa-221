import React from 'react';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';
import { getAdmissionsDb } from './admissionsDb';

interface Props {
  candidate: ExtendedCandidate;
}

export function CandidateAuditTab({ candidate }: Props) {
  const db = getAdmissionsDb();
  const logs = db.auditLogs.filter(l => l.candidateId === candidate.id);

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-neutral-600" id="candidate-audit-tab">
      <div>
        <h4 className="font-extrabold text-[#1E293B]">Traçabilité & Journal d'Audit</h4>
        <p className="text-[10px] text-neutral-400">Consultez l'historique complet et inaltérable des opérations effectuées sur votre dossier.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3">
        <span className="text-[9px] font-black uppercase text-[#B3181C] tracking-wider">Événements de Sécurité</span>
        {logs.length > 0 ? (
          <div className="space-y-2.5">
            {logs.map((log, index) => (
              <div key={log.id || index} className="flex gap-3 items-center justify-between p-2.5 bg-[#FAF8F6] border border-neutral-200 rounded-xl">
                <div className="space-y-0.5">
                  <div className="text-[#1E293B] font-black text-[11px]">{log.action}</div>
                  <div className="text-[9px] text-neutral-400 font-semibold">Par : <strong className="text-neutral-500">{log.user}</strong></div>
                </div>
                <div className="text-[9px] text-neutral-400 font-semibold font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-center py-6 text-neutral-400">
            <p>Aucun log d'audit enregistré pour l'instant.</p>
            <div className="p-2.5 bg-[#FAF8F6] rounded-lg border border-neutral-200 text-[10px] text-left inline-block max-w-sm">
              ℹ️ Les logs de sécurité s'incrémentent automatiquement lors d'un dépôt de document, d'un paiement, ou d'une décision de la scolarité.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
