import React, { useState } from 'react';
import { Room, Classe, PlanningSlot } from '../../../domain/SchoolModels';
import { PlanningSidebar } from './PlanningSidebar';
import { PlanningGrid } from './PlanningGrid';

interface Props {
  rooms: Room[];
  classes: Classe[];
  slots: PlanningSlot[];
  onUpdateSlots: (slots: PlanningSlot[]) => void;
}

export function PlanningTab({ rooms, classes, slots, onUpdateSlots }: Props) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleDropItem = (day: string, slot: string, item: { type: 'teacher' | 'room'; name: string }) => {
    if (!selectedClassId) return;
    const isRoom = item.type === 'room';
    const conf = slots.find(s => isRoom ? s.roomName === item.name && s.day === day && s.slot === slot : s.prof === item.name && s.day === day && s.slot === slot);
    if (conf && conf.classeId !== selectedClassId) {
      const opposing = classes.find(c => c.id === conf.classeId)?.name || conf.classeId;
      setErrorToast(`Conflit : ${isRoom ? 'La salle' : "L'enseignant"} "${item.name}" est déjà réservé par "${opposing}" le ${day} à ${slot}.`);
      setTimeout(() => setErrorToast(null), 5000);
      return;
    }
    const idx = slots.findIndex(s => s.classeId === selectedClassId && s.day === day && s.slot === slot);
    const updated = [...slots];
    const defaultSub = classes.find(c => c.id === selectedClassId)?.name?.includes('Civil') ? 'Ingénierie Structurale' : 'Intelligence Artificielle';
    if (idx > -1) {
      const target = { ...updated[idx] };
      if (isRoom) target.roomName = item.name;
      else target.prof = item.name;
      updated[idx] = target;
    } else {
      updated.push({ id: `p-${Date.now()}`, day, slot, classeId: selectedClassId, subject: defaultSub, prof: isRoom ? '' : item.name, roomName: isRoom ? item.name : '' });
    }
    onUpdateSlots(updated);
    setSuccessToast(`Affectation de ${item.name} réussie avec succès !`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleClearCell = (day: string, slot: string) => {
    onUpdateSlots(slots.filter(s => !(s.classeId === selectedClassId && s.day === day && s.slot === slot)));
    setSuccessToast('Créneau réinitialisé.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-4" id="planning-tab-root">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Gestion des Emplois du Temps</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer le planning sans conflits en glissant/déposant profs & salles.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase font-black text-neutral-400">Classe :</label>
          <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-bold focus:outline-none">
            {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
          </select>
        </div>
      </div>
      {errorToast && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl animate-bounce flex items-center gap-2"><span translate="no" className="material-symbols-outlined text-lg">error</span><span>{errorToast}</span></div>}
      {successToast && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"><span translate="no" className="material-symbols-outlined text-lg">check_circle</span><span>{successToast}</span></div>}
      <div className="flex gap-4 items-start">
        <PlanningGrid slots={slots} viewMode="class" selectedId={selectedClassId} onDropItem={handleDropItem} onClearCell={handleClearCell} />
        <PlanningSidebar rooms={rooms} />
      </div>
    </div>
  );
}

