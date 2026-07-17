import { useState, useCallback } from 'react';
import { CalendarSlot, UnassignedCourse, ConflictAlert, TeacherSubjectAssociation, AuditLog, INITIAL_SLOTS, INITIAL_UNASSIGNED, INITIAL_CONFLICTS } from '../domain/PlanningModels';
import { checkSchedulingConflicts, autoSuggestSubject } from '../domain/PlanningRulesEngine';

export function useAdminSchedulerState() {
  const [slots, setSlots] = useState<CalendarSlot[]>(INITIAL_SLOTS);
  const [unassigned, setUnassigned] = useState<UnassignedCourse[]>(INITIAL_UNASSIGNED);
  const [conflicts, setConflicts] = useState<ConflictAlert[]>(INITIAL_CONFLICTS);
  const [associations, setAssociations] = useState<TeacherSubjectAssociation[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [week, setWeek] = useState(1);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = useCallback((msg: string, succ: boolean) => {
    setToast({ message: msg, success: succ });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addLog = useCallback((act: string, target: string, oldV: string, newV: string, motif: string) => {
    const t = new Date();
    setLogs(prev => [{
      id: `l-${Date.now()}`, author: 'Admin Principal', date: t.toLocaleDateString('fr'),
      time: t.toLocaleTimeString('fr'), action: act, target, oldValue: oldV, newValue: newV, motif
    }, ...prev]);
  }, []);

  const scheduleCourse = useCallback((courseId: string, day: string, slotTime: string, forcedRoom?: string) => {
    const course = unassigned.find(c => c.id === courseId);
    if (!course) return;

    const targetRoom = forcedRoom || course.room;
    const finalSubject = autoSuggestSubject(course.prof, course.classe, associations) || course.subject;
    const newSlot: CalendarSlot = {
      id: `slot-${Date.now()}`, subject: finalSubject, prof: course.prof, room: targetRoom,
      classe: course.classe, day, slot: slotTime, type: course.type, faculte: course.faculte,
      departement: course.departement, filiere: course.filiere, niveau: course.niveau,
      semestre: 'Semestre 1', anneeAcademique: '2025-2026', groupe: 'Aucun',
      building: targetRoom.includes('Amphi') ? 'Bâtiment Central' : 'Bâtiment B',
      capacityRequired: course.capacityRequired, isPublished: false, weekNumber: week
    };

    const errs = checkSchedulingConflicts(newSlot, slots, week);
    if (errs.some(c => c.severity === 'high')) {
      setConflicts(prev => [...errs, ...prev]);
      showToast(`Conflit bloquant : ${errs[0].message}`, false);
      return;
    }
    if (errs.length > 0) setConflicts(prev => [...errs, ...prev]);

    if (finalSubject === course.subject) {
      setAssociations(prev => [...prev, {
        id: `as-${Date.now()}`, prof: course.prof, classe: course.classe,
        subject: course.subject, semestre: 'Semestre 1', anneeAcademique: '2025-2026'
      }]);
    }
    setSlots(prev => [...prev, newSlot]);
    setUnassigned(prev => prev.filter(c => c.id !== courseId));
    addLog('Ajout', newSlot.subject, 'En attente', `Planifié ${day} ${slotTime}`, 'Planification manuelle');
    showToast(`Cours de ${finalSubject} planifié !`, true);
  }, [unassigned, slots, week, associations, addLog, showToast]);

  const removeSlot = useCallback((id: string, motif = 'Retrait') => {
    const s = slots.find(item => item.id === id);
    if (!s) return;
    setUnassigned(p => [...p, {
      id: `un-${Date.now()}`, subject: s.subject, prof: s.prof, room: s.room, classe: s.classe,
      duration: '2h', faculte: s.faculte, departement: s.departement, filiere: s.filiere,
      niveau: s.niveau, type: s.type, capacityRequired: s.capacityRequired
    }]);
    setSlots(prev => prev.filter(item => item.id !== id));
    addLog('Suppression', s.subject, `${s.day} ${s.slot}`, 'En attente', motif);
    showToast(`Cours de ${s.subject} remis en attente.`, true);
  }, [slots, addLog, showToast]);

  const moveCourse = useCallback((slotId: string, day: string, slotTime: string) => {
    const s = slots.find(item => item.id === slotId);
    if (!s) return;
    const updated = { ...s, day, slot: slotTime };
    const errs = checkSchedulingConflicts(updated, slots, week);
    if (errs.some(c => c.severity === 'high')) {
      setConflicts(prev => [...errs, ...prev]);
      showToast(`Conflit : ${errs[0].message}`, false);
      return;
    }
    setSlots(prev => prev.map(item => item.id === slotId ? updated : item));
    addLog('Modification', s.subject, `${s.day} ${s.slot}`, `${day} ${slotTime}`, 'Déplacement');
    showToast(`Cours déplacé avec succès !`, true);
  }, [slots, week, addLog, showToast]);

  const duplicateCourse = useCallback((slotId: string, day: string, slotTime: string) => {
    const s = slots.find(item => item.id === slotId);
    if (!s) return;
    const dup: CalendarSlot = { ...s, id: `slot-${Date.now()}`, day, slot: slotTime };
    const errs = checkSchedulingConflicts(dup, slots, week);
    if (errs.some(c => c.severity === 'high')) {
      setConflicts(prev => [...errs, ...prev]);
      showToast(`Conflit : ${errs[0].message}`, false);
      return;
    }
    setSlots(prev => [...prev, dup]);
    addLog('Ajout', s.subject, 'Copie', `${day} ${slotTime}`, 'Duplication');
    showToast(`Cours dupliqué avec succès !`, true);
  }, [slots, week, addLog, showToast]);

  return { slots, setSlots, unassigned, setUnassigned, conflicts, setConflicts, associations, setAssociations, logs, setLogs, week, setWeek, toast, showToast, addLog, scheduleCourse, removeSlot, moveCourse, duplicateCourse };
}
