import React, { useState } from 'react';
import { ExtendedCandidate, CandidateDocs } from '@/features/admin/domain/AdmissionsExtendedModels';
import { getAdmissionsDb, saveAdmissionsDb, addAuditLog } from './admissionsDb';

interface Props {
  candidate: ExtendedCandidate;
  onUpdate: (updated: ExtendedCandidate) => void;
}

export function CandidateDocumentsTab({ candidate, onUpdate }: Props) {
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const documentList = [
    { key: 'idCard' as keyof CandidateDocs, label: 'Pièce d\'identité (CNI/Passeport)', required: true },
    { key: 'diploma' as keyof CandidateDocs, label: 'Attestation de Réussite / Diplôme', required: true },
    { key: 'transcripts' as keyof CandidateDocs, label: 'Relevés de Notes du Bac ou Cursus', required: false },
    { key: 'equivalenceLetter' as keyof CandidateDocs, label: 'Lettre d\'Équivalence Consulaire', required: false }
  ];

  const handleSimulateUpload = (key: keyof CandidateDocs) => {
    setLoadingFile(key);
    setTimeout(() => {
      const db = getAdmissionsDb();
      const updatedCandidates = db.candidates.map(c => {
        if (c.id === candidate.id) {
          const newDocs = { ...c.docs, [key]: true };
          const updated: ExtendedCandidate = { ...c, docs: newDocs };
          return updated;
        }
        return c;
      });

      saveAdmissionsDb({ candidates: updatedCandidates });
      const current = updatedCandidates.find(c => c.id === candidate.id);
      if (current) {
        addAuditLog(candidate.id, `Téléchargement correctif de document : ${String(key)}`, candidate.name);
        onUpdate(current);
      }
      setLoadingFile(null);
    }, 1000);
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-neutral-600" id="candidate-documents-tab">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-[#1E293B]">Portefeuille de Pièces Justificatives</h4>
          <p className="text-[10px] text-neutral-400">Veuillez téléverser des images claires aux formats PDF, JPG ou PNG.</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
        {documentList.map((doc, i) => {
          const isUploaded = !!candidate.docs?.[doc.key];
          // Simuler des motifs de corrections pour faire pro !
          const hasCorrectionRequest = !isUploaded && doc.required;

          return (
            <div key={i} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isUploaded ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="font-black text-[#1E293B]">{doc.label}</span>
                  {doc.required && <span className="text-[#B3181C] text-[10px] font-black">* Requis</span>}
                </div>
                <div className="text-[10px] font-semibold text-neutral-400">
                  {isUploaded ? (
                    <span className="text-emerald-600 font-extrabold">✓ Document validé par le service d'admissions</span>
                  ) : hasCorrectionRequest ? (
                    <span className="text-amber-600 font-extrabold flex items-center gap-1">
                      ⚠️ Pièce manquante ou rejetée : [ Motif : document illisible ou non-conforme ]
                    </span>
                  ) : (
                    <span>Facultatif - non fourni</span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {loadingFile === doc.key ? (
                  <button disabled className="px-3 py-1.5 bg-neutral-100 text-neutral-400 rounded-xl flex items-center gap-1.5 text-[9.5px] uppercase font-black">
                    <span className="w-3 h-3 border-2 border-[#B3181C] border-t-transparent rounded-full animate-spin" />
                    Envoi...
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulateUpload(doc.key)}
                    className="px-3.5 py-1.5 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl text-[9.5px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <span translate="no" className="material-symbols-outlined text-[13px] font-bold">upload_file</span>
                    <span>{isUploaded ? 'Remplacer' : 'Télécharger'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
