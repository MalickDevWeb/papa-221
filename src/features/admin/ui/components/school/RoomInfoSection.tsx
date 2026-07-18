import React, { useState } from 'react';
import { Room } from '../../../domain/SchoolModels';

interface Props {
  room: Room;
  onUpdate: (room: Room) => void;
}

const EQ_LIST = ['Projecteur', 'Climatisation', 'PC Fixes', 'Maquettes', 'Tableau'];

export function RoomInfoSection({ room, onUpdate }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(room.name);
  const [capacity, setCapacity] = useState(room.capacity);
  const [status, setStatus] = useState(room.status);
  const [eqs, setEqs] = useState<string[]>(room.equipment);

  const handleSave = () => {
    onUpdate({ ...room, name, capacity, status, equipment: eqs });
    setIsEdit(false);
  };

  const handleStatusToggle = () => {
    const nextStatus = status === 'Disponible' ? 'Occupée' : 'Disponible';
    setStatus(nextStatus);
    onUpdate({ ...room, status: nextStatus });
  };

  return (
    <div className="space-y-4">
      <div className="bg-neutral-50 p-3 rounded-xl flex items-center justify-between border border-neutral-100">
        <div>
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Statut Actuel</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
            status === 'Disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>{status}</span>
        </div>
        <button
          onClick={handleStatusToggle}
          className="px-2.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[10px] font-extrabold rounded-lg transition-all shadow-sm cursor-pointer"
        >
          Marquer comme {status === 'Disponible' ? 'Occupée' : 'Disponible'}
        </button>
      </div>

      {isEdit ? (
        <div className="space-y-3 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200">
          <div>
            <label className="text-[9px] uppercase font-bold text-neutral-400">Nom de la salle</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-2.5 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#B3181C]" />
          </div>
          <div>
            <label className="text-[9px] uppercase font-bold text-neutral-400">Capacité (places)</label>
            <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full mt-1 px-2.5 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Équipements</label>
            <div className="flex flex-wrap gap-1.5">
              {EQ_LIST.map(eq => (
                <button key={eq} type="button" onClick={() => setEqs(p => p.includes(eq) ? p.filter(x => x !== eq) : [...p, eq])} className={`px-2 py-0.5 text-[9px] font-bold rounded border ${eqs.includes(eq) ? 'bg-[#B3181C] text-white border-transparent' : 'bg-white text-neutral-500 border-neutral-200'}`}>{eq}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsEdit(false)} className="px-2.5 py-1 text-[10px] font-bold text-neutral-500 hover:bg-neutral-100 rounded-lg">Annuler</button>
            <button onClick={handleSave} className="px-2.5 py-1 bg-[#B3181C] text-white text-[10px] font-bold rounded-lg hover:bg-[#921316]">Enregistrer</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-extrabold text-neutral-800 text-sm">{room.name}</h4>
              <p className="text-[11px] text-neutral-500 font-semibold mt-0.5">Capacité de <strong className="text-neutral-700">{room.capacity} places</strong></p>
            </div>
            <button onClick={() => setIsEdit(true)} className="px-2 py-1 bg-[#B3181C]/10 text-[#B3181C] hover:bg-[#B3181C]/20 text-[10px] font-extrabold rounded-lg flex items-center gap-1 cursor-pointer">
              <span translate="no" className="material-symbols-outlined text-xs">edit</span>Modifier
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {room.equipment.map(eq => (
              <span key={eq} className="text-[8px] bg-neutral-100 text-neutral-500 font-bold px-1.5 py-0.5 rounded uppercase">{eq}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
