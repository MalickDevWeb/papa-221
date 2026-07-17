import React, { useState } from 'react';
import { Classe, Filiere } from '../../../domain/SchoolModels';
import { DeleteConfirmInput } from './DeleteConfirmInput';

interface Props {
  classe?: Classe | null;
  filieres: Filiere[];
  onClose: () => void;
  onSave: (classe: Classe) => void;
  onDelete?: (id: string) => void;
}

export function ClasseFormModal({ classe, filieres, onClose, onSave, onDelete }: Props) {
  const [level, setLevel] = useState(classe?.level || 'L1');
  const [filiereId, setFiliereId] = useState(classe?.filiereId || filieres[0]?.id || '');
  const [name, setName] = useState(classe?.name || '');
  const [capacity, setCapacity] = useState(classe?.capacityMax?.toString() || '40');
  const [price, setPrice] = useState(classe?.price?.toString() || '900000');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selFiliere = filieres.find(f => f.id === filiereId);
    if (!selFiliere) return;
    const computedName = name || `${level} ${selFiliere.name}`;
    onSave({
      id: classe?.id || `c-${Date.now()}`,
      name: computedName,
      level,
      filiereId,
      capacityMax: Number(capacity),
      price: Number(price),
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
        <h3 className="font-extrabold text-[#1E293B] text-sm border-b border-neutral-100 pb-2">
          {classe ? 'Modifier la Classe' : 'Créer une Nouvelle Classe'}
        </h3>

        {!isConfirmingDelete && (
          <div className="space-y-3 text-left">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Niveau</label>
                <select value={level} onChange={e => setLevel(e.target.value)} className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-bold focus:outline-none focus:border-[#B3181C]">
                  {['L1', 'L2', 'L3', 'M1', 'M2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Filière d'Étude</label>
                <select value={filiereId} onChange={e => setFiliereId(e.target.value)} className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-bold focus:outline-none focus:border-[#B3181C]">
                  {filieres.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-neutral-400">Libellé Personnalisé (Optionnel)</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="Laisser vide pour calcul automatique" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Capacité Max</label>
                <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-neutral-400">Frais Annuels (FCFA)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {isConfirmingDelete && onDelete && (
          <DeleteConfirmInput
            onConfirm={() => {
              onDelete(classe!.id);
              onClose();
            }}
            onCancel={() => setIsConfirmingDelete(false)}
          />
        )}

        {!isConfirmingDelete && (
          <div className="flex justify-between items-center pt-2">
            {classe && onDelete ? (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer border-0 bg-transparent"
              >
                <span translate="no" className="material-symbols-outlined text-xs">delete</span>
                <span>Supprimer</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 bg-white cursor-pointer">
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-[#B3181C] text-white rounded-xl text-xs font-bold hover:bg-[#921316] cursor-pointer border-0">
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
