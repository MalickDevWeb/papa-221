import React, { useState } from 'react';
import { Room, PlanningSlot } from '../../../domain/SchoolModels';
import { SlotEditFields } from './SlotEditFields';
import { DeleteConfirmInput } from './DeleteConfirmInput';

interface Props {
  slot: PlanningSlot;
  rooms: Room[];
  onClose: () => void;
  onSave: (updated: PlanningSlot) => void;
  onDelete: (id: string) => void;
}

export function SlotEditModal({ slot, rooms, onClose, onSave, onDelete }: Props) {
  const [subject, setSubject] = useState(slot.subject || '');
  const [prof, setProf] = useState(slot.prof || '');
  const [roomName, setRoomName] = useState(slot.roomName || '');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isLive = !!slot.isLive;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLive) return;
    onSave({ ...slot, subject, prof, roomName });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-[#B3181C]">edit_calendar</span>
            <span>{isLive ? 'Détails du Créneau (En Direct)' : 'Modifier le Créneau'}</span>
          </h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 border-0 bg-transparent cursor-pointer">
            <span translate="no" className="material-symbols-outlined text-sm font-black">close</span>
          </button>
        </div>

        {isLive && (
          <div className="bg-red-50 text-red-700 text-[10px] font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-red-600 inline-block"></span>
            <span>COURS EN DIRECT : Modification et suppression verrouillées par sécurité.</span>
          </div>
        )}

        <div className="bg-neutral-50 p-2.5 rounded-xl text-[11px] font-semibold text-neutral-600 space-y-1">
          <div>Classe : <span className="font-black text-[#1E293B]">{slot.classeId}</span></div>
          <div>Créneau : <span className="font-bold text-[#B3181C]">{slot.day} - {slot.slot}</span></div>
        </div>

        {!isConfirmingDelete && (
          <SlotEditFields
            subject={subject}
            setSubject={setSubject}
            prof={prof}
            setProf={setProf}
            roomName={roomName}
            setRoomName={setRoomName}
            isLive={isLive}
            rooms={rooms}
          />
        )}

        {isConfirmingDelete && (
          <DeleteConfirmInput
            onConfirm={() => {
              onDelete(slot.id);
            }}
            onCancel={() => setIsConfirmingDelete(false)}
          />
        )}

        {!isConfirmingDelete && (
          <div className="flex justify-between items-center pt-2">
            {!isLive ? (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer border-0 bg-transparent"
              >
                <span translate="no" className="material-symbols-outlined text-xs">delete</span>
                <span>Supprimer</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                <span translate="no" className="material-symbols-outlined text-xs">lock</span>
                Lecture seule
              </span>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 cursor-pointer bg-white"
              >
                Annuler
              </button>
              {!isLive && (
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#B3181C] text-white rounded-xl text-xs font-bold hover:bg-[#921316] cursor-pointer border-0"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
