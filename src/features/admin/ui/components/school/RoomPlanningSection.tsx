import React, { useState } from 'react';
import { Room, PlanningSlot } from '../../../domain/SchoolModels';
import { SlotEditModal } from './SlotEditModal';
import { notificationRepository } from '@/features/notifications/infrastructure/config/dependencies';

interface Props {
  room: Room;
  rooms: Room[];
  slots: PlanningSlot[];
  onUpdateSlots?: (updated: PlanningSlot[]) => void;
}

export function RoomPlanningSection({ room, rooms, slots, onUpdateSlots }: Props) {
  const [editingSlot, setEditingSlot] = useState<PlanningSlot | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  const roomSlots = slots.filter(s => s.roomName === room.name);

  const handleSelectSlot = (slot: PlanningSlot) => {
    if (slot.isLive) {
      setWarningMsg("Modification impossible : Ce cours est actuellement EN LIVE.");
      setTimeout(() => setWarningMsg(null), 3000);
      return;
    }
    setEditingSlot(slot);
  };

  const handleSaveSlot = (updated: PlanningSlot) => {
    if (!onUpdateSlots) return;
    onUpdateSlots(slots.map(s => s.id === updated.id ? updated : s));
    setEditingSlot(null);

    // Send Real-time notification to students and teachers
    notificationRepository.sendNotification({
      title: `Modification de Cours : ${updated.subject}`,
      desc: `Le cours de ${updated.prof} (Classe: ${updated.classeId}) en salle ${updated.roomName} a été mis à jour.`,
      time: "À l'instant",
      read: false,
      icon: 'schedule',
      color: 'text-amber-600 bg-amber-50',
    }).catch(err => console.warn('Firestore write inactive:', err));
  };

  const handleDeleteSlot = (id: string) => {
    if (!onUpdateSlots) return;
    const target = slots.find(s => s.id === id);
    onUpdateSlots(slots.filter(s => s.id !== id));
    setEditingSlot(null);

    if (target) {
      // Send Real-time notification
      notificationRepository.sendNotification({
        title: `Cours Annulé : ${target.subject}`,
        desc: `Le cours de ${target.prof} du ${target.day} (${target.slot}) a été annulé par l'administration.`,
        time: "À l'instant",
        read: false,
        icon: 'cancel',
        color: 'text-red-600 bg-red-50',
      }).catch(err => console.warn('Firestore write inactive:', err));
    }
  };

  return (
    <div className="pt-2 border-t border-neutral-100">
      <h4 className="font-extrabold text-neutral-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1">
        <span translate="no" className="material-symbols-outlined text-neutral-400 text-sm">calendar_month</span>
        <span>Emploi du Temps / Réservations</span>
      </h4>

      {warningMsg && (
        <div className="mb-2 bg-red-50 text-red-700 text-[10px] font-bold p-2.5 rounded-lg border border-red-100 flex items-center gap-1.5 animate-pulse">
          <span translate="no" className="material-symbols-outlined text-xs">lock</span>
          <span>{warningMsg}</span>
        </div>
      )}

      {roomSlots.length === 0 ? (
        <p className="text-[11px] text-neutral-400 font-semibold italic p-3 bg-neutral-50 rounded-xl text-center">Aucun cours planifié pour le moment.</p>
      ) : (
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {roomSlots.map(slot => (
            <div
              key={slot.id}
              onClick={() => handleSelectSlot(slot)}
              className="bg-white hover:bg-neutral-50 border border-neutral-100 p-2.5 rounded-xl shadow-xs flex items-center justify-between cursor-pointer transition-all hover:border-neutral-200"
            >
              <div>
                <p className="text-[11px] font-extrabold text-[#1E293B] flex items-center gap-1">
                  <span>{slot.subject}</span>
                  {slot.isLive && (
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[7px] font-black uppercase text-red-600 bg-red-50 border border-red-100 rounded animate-pulse">
                      🔴 Live
                    </span>
                  )}
                </p>
                <p className="text-[9px] text-neutral-400 font-semibold">{slot.prof} • Classe {slot.classeId}</p>
              </div>
              <span className="text-[9px] bg-red-50 text-[#B3181C] font-extrabold px-2 py-0.5 rounded-md border border-red-100">{slot.day} ({slot.slot})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
