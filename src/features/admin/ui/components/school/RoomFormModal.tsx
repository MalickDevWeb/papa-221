import React, { useState } from 'react';
import { Room } from '../../../domain/SchoolModels';

interface RoomFormModalProps {
  onClose: () => void;
  onSubmit: (roomData: { name: string; capacity: number; equipment: string[] }) => void;
}

const AVAILABLE_EQUIPMENTS = ['Projecteur', 'Climatisation', 'PC Fixes', 'Maquettes', 'Tableau'];

export function RoomFormModal({ onClose, onSubmit }: RoomFormModalProps) {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('40');
  const [equipments, setEquipments] = useState<string[]>(['Projecteur']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      capacity: Number(capacity) || 1,
      equipment: equipments,
    });
  };

  const toggleEquipment = (eq: string) => {
    setEquipments(prev =>
      prev.includes(eq) ? prev.filter(item => item !== eq) : [...prev, eq]
    );
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
        <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-[#B3181C]">add_circle</span>
          <span>Ajouter une Nouvelle Salle</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase font-black text-neutral-400">Nom de la Salle</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]"
              placeholder="ex: Salle 301, Labo Informatique"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-black text-neutral-400">Capacité (Places)</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              required
              min="1"
              className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-black text-neutral-400 block mb-1">Équipements</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_EQUIPMENTS.map(eq => {
                const active = equipments.includes(eq);
                return (
                  <button
                    type="button"
                    key={eq}
                    onClick={() => toggleEquipment(eq)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      active ? 'bg-[#B3181C] text-white border-transparent' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {eq}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#B3181C] text-white rounded-xl text-xs font-bold hover:bg-[#921316] cursor-pointer"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
