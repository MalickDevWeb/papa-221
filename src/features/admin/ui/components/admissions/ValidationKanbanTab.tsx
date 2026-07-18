import React, { useState } from 'react';
import { ExtendedCandidate } from '../../../domain/AdmissionsExtendedModels';
import { CandidateAdmissionBadge } from './CandidateAdmissionBadge';
import { CandidateDetailModal } from './CandidateDetailModal';

interface Props {
  candidates: ExtendedCandidate[];
  onUpdateCandidate: (updated: ExtendedCandidate) => void;
}

export function ValidationKanbanTab({ candidates, onUpdateCandidate }: Props) {
  const [selectedCandidate, setSelectedCandidate] = useState<ExtendedCandidate | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const columns: { id: ExtendedCandidate['step']; label: string; bg: string; border: string; text: string }[] = [
    { id: 'new', label: 'Nouveau Dossier', bg: 'bg-neutral-50/50', border: 'border-neutral-200', text: 'text-neutral-500' },
    { id: 'docs', label: 'Pièces Vérifiées', bg: 'bg-amber-50/20', border: 'border-amber-100', text: 'text-amber-600' },
    { id: 'admitted', label: 'Admis d\'office', bg: 'bg-emerald-50/20', border: 'border-emerald-100', text: 'text-emerald-600' },
    { id: 'rejected', label: 'Dossier Rejeté', bg: 'bg-rose-50/20', border: 'border-rose-100', text: 'text-rose-600' },
  ];

  const filteredCandidates = filterType === 'ALL'
    ? candidates
    : candidates.filter(c => c.type === filterType);

  return (
    <div className="space-y-4" id="validation-kanban-root">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-100 text-xs font-bold">
        <span className="text-[#1E293B]">Filtrer par type de candidature :</span>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#FAF8F6] border border-neutral-200 rounded-lg px-2 py-1 outline-none text-neutral-700 cursor-pointer"
        >
          <option value="ALL">Tous les types ({candidates.length})</option>
          <option value="BAC">Nouveau Bachelier (L1)</option>
          <option value="TRANSFER">Transfert Universitaire</option>
          <option value="REINSCRIPTION">Réinscription</option>
          <option value="INT">Étudiant International</option>
          <option value="VAE">Validation Acquis (VAE)</option>
          <option value="EXCEPT">Admission Exceptionnelle</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        {columns.map(col => {
          const list = filteredCandidates.filter(c => c.step === col.id);
          return (
            <div key={col.id} className={`${col.bg} border ${col.border} rounded-2xl p-4 flex flex-col space-y-3 min-h-[420px]`}>
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
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="text-[9px] text-neutral-400 font-extrabold truncate uppercase">{c.course}</span>
                      <CandidateAdmissionBadge type={c.type} />
                    </div>
                    {c.equivalence && (
                      <div className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 w-fit">
                        Équivalence : {c.equivalence.status === 'approved' ? 'Mappée ✓' : 'En Étude...'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdateCandidate={(updated) => {
            onUpdateCandidate(updated);
            setSelectedCandidate(updated);
          }}
        />
      )}
    </div>
  );
}
