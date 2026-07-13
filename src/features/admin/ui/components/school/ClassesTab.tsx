import React, { useState } from 'react';
import { Classe, Filiere } from '../../../domain/SchoolModels';

interface Props {
  classes: Classe[];
  filieres: Filiere[];
  onAddClasse: (classe: Classe) => void;
}

export function ClassesTab({ classes, filieres, onAddClasse }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState('L1');
  const [filiereId, setFiliereId] = useState(filieres[0]?.id || '');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('40');
  const [price, setPrice] = useState('900000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selFiliere = filieres.find(f => f.id === filiereId);
    if (!selFiliere) return;
    const computedName = name || `${level} ${selFiliere.name}`;
    const newClasse: Classe = {
      id: `c-${Date.now()}`,
      name: computedName,
      level,
      filiereId,
      capacityMax: Number(capacity),
      price: Number(price),
    };
    onAddClasse(newClasse);
    setName('');
    setShowModal(false);
  };

  return (
    <div className="space-y-4" id="classes-tab-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Classes & Niveaux d'Écolage</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer les promotions, capacités et frais annuels.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 bg-[#B3181C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#921316] transition-all flex items-center gap-1.5 cursor-pointer"
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
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {classes.map(cls => {
                const fName = filieres.find(f => f.id === cls.filiereId)?.name || 'N/A';
                return (
                  <tr key={cls.id} className="hover:bg-neutral-50/40">
                    <td className="px-5 py-3.5 text-[#1E293B]">{cls.name}</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-0.5 bg-neutral-100 text-[#1E293B] rounded-md">{cls.level}</span></td>
                    <td className="px-5 py-3.5 text-neutral-500 font-semibold">{fName}</td>
                    <td className="px-5 py-3.5 text-neutral-700">{cls.capacityMax} étudiants max</td>
                    <td className="px-5 py-3.5 text-right text-emerald-600 font-extrabold">{cls.price.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
            <h3 className="font-extrabold text-[#1E293B] text-sm">Créer une Nouvelle Classe</h3>
            <div className="space-y-3">
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
