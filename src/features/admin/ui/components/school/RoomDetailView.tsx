import React, { useState } from 'react';
import { Room, PlanningSlot } from '../../../domain/SchoolModels';
import { RoomInfoSection } from './RoomInfoSection';
import { RoomPlanningSection } from './RoomPlanningSection';
import { DeleteConfirmInput } from './DeleteConfirmInput';

interface Props {
  room: Room;
  rooms: Room[];
  slots: PlanningSlot[];
  onUpdateSlots?: (updated: PlanningSlot[]) => void;
  onClose: () => void;
  onUpdate: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomDetailView({ room, rooms, slots, onUpdateSlots, onClose, onUpdate, onDelete }: Props) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C] text-xl">door_open</span>
            <h3 className="font-extrabold text-[#1E293B] text-sm">Dashboard : {room.name}</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 border-0 bg-transparent cursor-pointer">
            <span translate="no" className="material-symbols-outlined text-sm font-black">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-grow">
          {isConfirmingDelete ? (
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <DeleteConfirmInput
                onConfirm={() => {
                  onDelete(room.id);
                  onClose();
                }}
                onCancel={() => setIsConfirmingDelete(false)}
              />
            </div>
          ) : (
            <>
              <RoomInfoSection room={room} onUpdate={onUpdate} />
              <RoomPlanningSection room={room} rooms={rooms} slots={slots} onUpdateSlots={onUpdateSlots} />
            </>
          )}
        </div>

        {!isConfirmingDelete && (
          <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100 flex justify-between items-center">
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="text-[10px] font-extrabold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer border-0 bg-transparent"
            >
              <span translate="no" className="material-symbols-outlined text-xs">delete</span>Supprimer
            </button>
            <button onClick={onClose} className="px-4 py-1.5 bg-[#1E293B] text-white text-[10px] font-bold rounded-xl hover:bg-neutral-800 cursor-pointer border-0">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
