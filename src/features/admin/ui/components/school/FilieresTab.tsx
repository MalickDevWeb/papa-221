import React, { useState } from 'react';
import { Filiere } from '../../../domain/SchoolModels';

interface Props {
  filieres: Filiere[];
  onAddFiliere: (filiere: Filiere) => void;
}

export function FilieresTab({ filieres, onAddFiliere }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    const newFiliere: Filiere = {
      id: `f-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      description: desc,
    };
    onAddFiliere(newFiliere);
    setName('');
    setCode('');
    setDesc('');
    setShowModal(false);
  };

  return (
    <div className="space-y-4" id="filieres-tab-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Filières & Spécialités d'Études</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer les grands secteurs d'enseignement.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-[#B3181C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#921316] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-sm font-black">add</span>
          <span>Nouvelle Filière</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filieres.map(fil => (
          <div key={fil.id} className="bg-white border border-[#E2DCDA] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-[#B3181C] px-2 py-0.5 rounded-full border border-rose-100">
                  {fil.code}
                </span>
                <span translate="no" className="material-symbols-outlined text-neutral-400 text-lg">folder_open</span>
              </div>
              <h4 className="font-extrabold text-[#1E293B] text-sm mt-3">{fil.name}</h4>
              <p className="text-[11px] text-neutral-500 font-semibold mt-1">{fil.description || 'Aucune description fournie.'}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
            <h3 className="font-extrabold text-[#1E293B] text-sm">Ajouter une Nouvelle Filière</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Nom de la Filière</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="ex: Génie logiciel et Intelligence Artificielle" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Code (Court)</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="ex: GLIA" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full mt-1 p-3 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="Présentation rapide de la filière d'études..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-[#B3181C] text-white rounded-xl text-xs font-bold hover:bg-[#921316]">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
