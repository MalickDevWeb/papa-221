import React, { useState } from 'react';
import { Classe, Filiere } from '../../../domain/SchoolModels';
import { ClasseFormModal } from './ClasseFormModal';

interface Props {
  classes: Classe[];
  filieres: Filiere[];
  onUpdateClasses: (classes: Classe[]) => void;
}

export function ClassesTab({ classes, filieres, onUpdateClasses }: Props) {
  const [activeClasse, setActiveClasse] = useState<Classe | null | undefined>(undefined);

  const handleSave = (saved: Classe) => {
    if (activeClasse) {
      onUpdateClasses(classes.map(c => c.id === saved.id ? saved : c));
    } else {
      onUpdateClasses([...classes, saved]);
    }
    setActiveClasse(undefined);
  };

  const handleDelete = (id: string) => {
    onUpdateClasses(classes.filter(c => c.id !== id));
    setActiveClasse(undefined);
  };

  return (
    <div className="space-y-4" id="classes-tab-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Classes & Niveaux d'Écolage</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer les promotions, capacités et frais annuels.</p>
        </div>
        <button
          onClick={() => setActiveClasse(null)}
          className="px-3.5 py-2 bg-[#B3181C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#921316] transition-all flex items-center gap-1.5 cursor-pointer border-0"
        >
          <span translate="no" className="material-symbols-outlined text-sm font-black">add</span>
          <span>Créer une Classe</span>
        </button>
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold text-neutral-600">
            <thead>
              <tr className="bg-[#FAF8F6] text-[10px] font-black text-neutral-400 uppercase tracking-wider border-b border-neutral-200">
                <th className="px-5 py-3">Classe</th>
                <th className="px-5 py-3">Niveau</th>
                <th className="px-5 py-3">Filière Associée</th>
                <th className="px-5 py-3">Capacité Max</th>
                <th className="px-5 py-3 text-right">Frais d'Écolage Annuel</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {classes.map(cls => {
                const fName = filieres.find(f => f.id === cls.filiereId)?.name || 'N/A';
                return (
                  <tr key={cls.id} className="hover:bg-neutral-50/60 transition-colors group">
                    <td className="px-5 py-3.5 text-[#1E293B] font-extrabold">{cls.name}</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-0.5 bg-neutral-100 text-[#1E293B] rounded-md">{cls.level}</span></td>
                    <td className="px-5 py-3.5 text-neutral-500 font-semibold">{fName}</td>
                    <td className="px-5 py-3.5 text-neutral-700">{cls.capacityMax} étudiants max</td>
                    <td className="px-5 py-3.5 text-right text-emerald-600 font-extrabold">{cls.price.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => setActiveClasse(cls)}
                        className="p-1 text-neutral-400 hover:text-[#B3181C] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer border-0 bg-transparent inline-flex items-center"
                      >
                        <span translate="no" className="material-symbols-outlined text-sm font-black">edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {activeClasse !== undefined && (
        <ClasseFormModal
          classe={activeClasse}
          filieres={filieres}
          onClose={() => setActiveClasse(undefined)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
