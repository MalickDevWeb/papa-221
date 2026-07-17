import React from 'react';
import { Room } from '../../../domain/SchoolModels';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
  const isDisponible = room.status === 'Disponible';

  return (
    <div className="bg-white border border-[#E2DCDA] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between">
          <span translate="no" className="material-symbols-outlined text-neutral-400 text-2xl">meeting_room</span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            isDisponible 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {room.status}
          </span>
        </div>
        <h4 className="font-extrabold text-[#1E293B] text-sm mt-3">{room.name}</h4>
        <p className="text-[11px] text-neutral-500 font-semibold mt-1">
          Capacité : <strong className="text-neutral-800">{room.capacity} places</strong>
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-1">
          {room.equipment.map(eq => (
            <span key={eq} className="text-[8px] bg-neutral-100 text-neutral-500 font-bold px-1.5 py-0.5 rounded uppercase">
              {eq}
            </span>
          ))}
        </div>
        <button
          onClick={() => onSelect(room)}
          className="w-full mt-1.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[10px] font-extrabold rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-xs">login</span>
          <span>Entrer & Modifier</span>
        </button>
      </div>
    </div>
  );
}
