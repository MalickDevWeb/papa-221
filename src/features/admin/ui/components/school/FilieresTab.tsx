import React, { useState } from 'react';
import { Filiere } from '../../../domain/SchoolModels';
import { FiliereFormModal } from './FiliereFormModal';

interface Props {
  filieres: Filiere[];
  onUpdateFilieres: (filieres: Filiere[]) => void;
}

export function FilieresTab({ filieres, onUpdateFilieres }: Props) {
  const [activeFiliere, setActiveFiliere] = useState<Filiere | null | undefined>(undefined);

  const handleSave = (saved: Filiere) => {
    if (activeFiliere) {
      onUpdateFilieres(filieres.map(f => f.id === saved.id ? saved : f));
    } else {
      onUpdateFilieres([...filieres, saved]);
    }
    setActiveFiliere(undefined);
  };

  const handleDelete = (id: string) => {
    onUpdateFilieres(filieres.filter(f => f.id !== id));
    setActiveFiliere(undefined);
  };

  return (
    <div className="space-y-4" id="filieres-tab-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Filières & Spécialités d'Études</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer les grands secteurs d'enseignement.</p>
        </div>
        <button
          onClick={() => setActiveFiliere(null)}
          className="px-3.5 py-2 bg-[#B3181C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#921316] transition-all flex items-center gap-1.5 cursor-pointer border-0"
        >
          <span translate="no" className="material-symbols-outlined text-sm font-black">add</span>
          <span>Nouvelle Filière</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filieres.map(fil => (
          <div
            key={fil.id}
            onClick={() => setActiveFiliere(fil)}
            className="bg-white border border-[#E2DCDA] hover:border-[#B3181C]/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-[#B3181C] px-2 py-0.5 rounded-full border border-rose-100">
                  {fil.code}
                </span>
                <span translate="no" className="material-symbols-outlined text-neutral-400 group-hover:text-[#B3181C] text-lg transition-colors">edit_note</span>
              </div>
              <h4 className="font-extrabold text-[#1E293B] text-sm mt-3">{fil.name}</h4>
              <p className="text-[11px] text-neutral-500 font-semibold mt-1">{fil.description || 'Aucune description fournie.'}</p>
            </div>
          </div>
        ))}
      </div>

      {activeFiliere !== undefined && (
        <FiliereFormModal
          filiere={activeFiliere}
          onClose={() => setActiveFiliere(undefined)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
