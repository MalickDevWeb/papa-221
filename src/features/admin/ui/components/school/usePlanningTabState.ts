import { useState } from 'react';
import { Classe, PlanningSlot } from '../../../domain/SchoolModels';
import { notificationRepository } from '@/features/notifications/infrastructure/config/dependencies';

export function usePlanningTabState(
  classes: Classe[],
  slots: PlanningSlot[],
  onUpdateSlots: (slots: PlanningSlot[]) => void
) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<PlanningSlot | null>(null);
  const [pendingConflict, setPendingConflict] = useState<any | null>(null);
  const [clearingCell, setClearingCell] = useState<{ day: string; slot: string } | null>(null);

  const executeAssignment = (day: string, slot: string, item: { type: 'teacher' | 'room'; name: string }) => {
    const isRoom = item.type === 'room';
    const idx = slots.findIndex(s => s.classeId === selectedClassId && s.day === day && s.slot === slot);
    const updated = [...slots];
    const defSub = classes.find(c => c.id === selectedClassId)?.name?.includes('Civil') ? 'Ingénierie Structurale' : 'Intelligence Artificielle';
    if (idx > -1) {
      updated[idx] = { ...updated[idx], [isRoom ? 'roomName' : 'prof']: item.name };
    } else {
      updated.push({ id: `p-${Date.now()}`, day, slot, classeId: selectedClassId, subject: defSub, prof: isRoom ? '' : item.name, roomName: isRoom ? item.name : '' });
    }
    onUpdateSlots(updated);
    setSuccessToast(`Affectation de ${item.name} réussie !`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDropItem = (day: string, slot: string, item: { type: 'teacher' | 'room'; name: string }) => {
    if (!selectedClassId) return;
    const isRoom = item.type === 'room';
    const current = slots.find(s => s.classeId === selectedClassId && s.day === day && s.slot === slot);
    if (current?.isLive) {
      setErrorToast("Modification impossible : Ce cours est actuellement EN LIVE.");
      setTimeout(() => setErrorToast(null), 5000);
      return;
    }
    const conf = slots.find(s => isRoom ? s.roomName === item.name && s.day === day && s.slot === slot : s.prof === item.name && s.day === day && s.slot === slot);
    if (conf && conf.classeId !== selectedClassId) {
      const opposing = classes.find(c => c.id === conf.classeId)?.name || conf.classeId;
      setPendingConflict({
        type: item.type, name: item.name, day, slot, conflictingSlot: conf, conflictingClassName: opposing,
        onResolve: () => { executeAssignment(day, slot, item); setPendingConflict(null); }
      });
      return;
    }
    executeAssignment(day, slot, item);
  };

  const handleClearCell = (day: string, slot: string) => {
    const current = slots.find(s => s.classeId === selectedClassId && s.day === day && s.slot === slot);
    if (current?.isLive) {
      setErrorToast("Modification impossible : Ce cours est actuellement EN LIVE.");
      setTimeout(() => setErrorToast(null), 5000);
      return;
    }
    setClearingCell({ day, slot });
  };

  const executeClearCell = () => {
    if (!clearingCell) return;
    const { day, slot } = clearingCell;
    onUpdateSlots(slots.filter(s => !(s.classeId === selectedClassId && s.day === day && s.slot === slot)));
    setSuccessToast('Créneau réinitialisé.');
    setTimeout(() => setSuccessToast(null), 3000);
    setClearingCell(null);
  };

  const handleSaveSlot = (updated: PlanningSlot) => {
    onUpdateSlots(slots.map(s => s.id === updated.id ? updated : s));
    setEditingSlot(null);
    setSuccessToast('Créneau mis à jour.');
    setTimeout(() => setSuccessToast(null), 3000);
    notificationRepository.sendNotification({
      title: `Planning Modifié : ${updated.subject}`,
      desc: `Le cours de ${updated.prof} (Classe: ${updated.classeId}) en salle ${updated.roomName || 'Sans salle'} a été mis à jour par l'administration.`,
      time: "À l'instant", read: false, icon: 'schedule', color: 'text-amber-600 bg-amber-50',
    }).catch(() => null);
  };

  const handleDeleteSlot = (id: string) => {
    const target = slots.find(s => s.id === id);
    if (target?.isLive) {
      setErrorToast("Modification impossible : Ce cours est actuellement EN LIVE.");
      setTimeout(() => setErrorToast(null), 5000);
      return;
    }
    onUpdateSlots(slots.filter(s => s.id !== id));
    setEditingSlot(null);
    setSuccessToast('Créneau supprimé.');
    setTimeout(() => setSuccessToast(null), 3000);
    if (target) {
      notificationRepository.sendNotification({
        title: `Cours Annulé : ${target.subject}`,
        desc: `Le cours de ${target.prof} du ${target.day} (${target.slot}) a été annulé par l'administration.`,
        time: "À l'instant", read: false, icon: 'cancel', color: 'text-red-600 bg-red-50',
      }).catch(() => null);
    }
  };

  return {
    selectedClassId, setSelectedClassId, errorToast, successToast,
    editingSlot, setEditingSlot, pendingConflict, setPendingConflict,
    clearingCell, setClearingCell, executeClearCell,
    handleDropItem, handleClearCell, handleSaveSlot, handleDeleteSlot,
  };
}
