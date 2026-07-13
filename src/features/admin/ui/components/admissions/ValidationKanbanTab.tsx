import React, { useState } from 'react';
import { Candidate } from '../../../domain/AdmissionsModels';

interface Props {
  candidates: Candidate[];
  onMoveCandidate: (id: string, step: Candidate['step']) => void;
}

export function ValidationKanbanTab({ candidates, onMoveCandidate }: Props) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const columns: { id: Candidate['step']; label: string; bg: string; border: string; text: string }[] = [
    { id: 'new', label: 'Nouveau Dossier', bg: 'bg-neutral-50/50', border: 'border-neutral-200', text: 'text-neutral-500' },
    { id: 'docs', label: 'Pièces Vérifiées', bg: 'bg-amber-50/20', border: 'border-amber-100', text: 'text-amber-600' },
    { id: 'admitted', label: 'Admis / En Attente', bg: 'bg-emerald-50/20', border: 'border-emerald-100', text: 'text-emerald-600' },
    { id: 'rejected', label: 'Dossier Rejeté', bg: 'bg-rose-50/20', border: 'border-rose-100', text: 'text-rose-600' },
  ];

  return (
    <div className="space-y-4" id="validation-kanban-root">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        {columns.map(col => {
          const list = candidates.filter(c => c.step === col.id);
          return (
            <div key={col.id} className={`${col.bg} border ${col.border} rounded-2xl p-4 flex flex-col space-y-3 min-h-[380px]`}>
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                <span className={`text-[10px] font-black uppercase tracking-wider ${col.text}`}>{col.label}</span>
                <span className="text-[10px] font-black bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-500">{list.length}</span>
              </div>

              <div className="flex-grow space-y-2.5 overflow-y-auto max-h-[350px] no-scrollbar">
                {list.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className="bg-white border border-neutral-200 hover:border-[#B3181C] p-3 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="font-extrabold text-xs text-[#1E293B] leading-snug">{c.name}</div>
                    <div className="text-[9px] text-neutral-400 font-bold uppercase">{c.course}</div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-[8px] font-black">
                      <span className={c.docs.diploma && c.docs.idCard ? 'text-emerald-600' : 'text-amber-500'}>
                        {c.docs.diploma && c.docs.idCard ? 'Dossier Complet' : 'Incomplet'}
                      </span>
                      <span className={c.registrationFeePaid ? 'text-emerald-500' : 'text-neutral-400'}>
                        {c.registrationFeePaid ? 'Frais OK' : 'Non payé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
            <div>
              <h3 className="font-extrabold text-[#1E293B] text-sm">Visualisation du Dossier Candidat</h3>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">{selectedCandidate.id}</p>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl space-y-2 text-xs font-bold text-neutral-600">
              <div className="flex justify-between"><span>Nom Complet :</span><span className="text-[#1E293B]">{selectedCandidate.name}</span></div>
              <div className="flex justify-between"><span>Filière demandée :</span><span className="text-[#1E293B]">{selectedCandidate.course}</span></div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                <span>Diplômes Requis :</span>
                <span className={selectedCandidate.docs.diploma ? 'text-emerald-600' : 'text-rose-600'}>
                  {selectedCandidate.docs.diploma ? '✓ Validé' : '✗ Manquant'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pièce d'Identité :</span>
                <span className={selectedCandidate.docs.idCard ? 'text-emerald-600' : 'text-rose-600'}>
                  {selectedCandidate.docs.idCard ? '✓ Reçue' : '✗ Manquant'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Déplacer l'état du dossier</span>
              <div className="grid grid-cols-2 gap-2">
                {columns.filter(col => col.id !== selectedCandidate.step).map(col => (
                  <button
                    key={col.id}
                    onClick={() => { onMoveCandidate(selectedCandidate.id, col.id); setSelectedCandidate(null); }}
                    className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 hover:text-black rounded-lg text-[9px] font-black uppercase text-left transition-all"
                  >
                    👉 {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button onClick={() => setSelectedCandidate(null)} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 cursor-pointer">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
