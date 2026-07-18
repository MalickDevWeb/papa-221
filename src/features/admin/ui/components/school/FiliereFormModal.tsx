import React, { useState } from 'react';
import { Filiere } from '../../../domain/SchoolModels';
import { DeleteConfirmInput } from './DeleteConfirmInput';

interface Props {
  filiere?: Filiere | null;
  onClose: () => void;
  onSave: (filiere: Filiere) => void;
  onDelete?: (id: string) => void;
}

export function FiliereFormModal({ filiere, onClose, onSave, onDelete }: Props) {
  const [name, setName] = useState(filiere?.name || '');
  const [code, setCode] = useState(filiere?.code || '');
  const [desc, setDesc] = useState(filiere?.description || '');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    onSave({
      id: filiere?.id || `f-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      description: desc,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
        <h3 className="font-extrabold text-[#1E293B] text-sm border-b border-neutral-100 pb-2">
          {filiere ? 'Modifier la Filière' : 'Ajouter une Nouvelle Filière'}
        </h3>

        {!isConfirmingDelete && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-black text-neutral-400">Nom de la Filière</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="ex: Génie logiciel" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-neutral-400">Code (Court)</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="ex: GL" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-neutral-400">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full mt-1 p-3 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]" placeholder="Présentation rapide de la filière..." />
            </div>
          </div>
        )}

        {isConfirmingDelete && onDelete && (
          <DeleteConfirmInput
            onConfirm={() => {
              onDelete(filiere!.id);
              onClose();
            }}
            onCancel={() => setIsConfirmingDelete(false)}
          />
        )}

        {!isConfirmingDelete && (
          <div className="flex justify-between items-center pt-2">
            {filiere && onDelete ? (
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
