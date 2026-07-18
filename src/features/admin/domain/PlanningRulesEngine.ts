import { CalendarSlot, ConflictAlert, TeacherSubjectAssociation, INITIAL_TEACHERS, INITIAL_ROOMS } from './PlanningModels';

export function checkSchedulingConflicts(
  slot: Partial<CalendarSlot>,
  allSlots: CalendarSlot[],
  weekNumber: number
): ConflictAlert[] {
  const alerts: ConflictAlert[] = [];
  const nowStr = 'À l\'instant';

  if (!slot.day || !slot.slot) return alerts;

  // 1. Same Room Conflict
  const roomConflict = allSlots.find(
    (s) => s.id !== slot.id && s.day === slot.day && s.slot === slot.slot && s.room === slot.room && (s.weekNumber || 1) === weekNumber
  );
  if (roomConflict) {
    alerts.push({
      id: `err-room-${Date.now()}-${Math.random()}`,
      type: 'Salle',
      message: `La salle "${slot.room}" est déjà occupée par "${roomConflict.subject}" (${roomConflict.classe}) ce ${slot.day} à ${slot.slot}.`,
      timestamp: nowStr,
      severity: 'high',
    });
  }

  // 2. Same Teacher Conflict
  const profConflict = allSlots.find(
    (s) => s.id !== slot.id && s.day === slot.day && s.slot === slot.slot && s.prof === slot.prof && (s.weekNumber || 1) === weekNumber
  );
  if (profConflict) {
    alerts.push({
      id: `err-prof-${Date.now()}-${Math.random()}`,
      type: 'Enseignant',
      message: `L'enseignant "${slot.prof}" donne déjà le cours "${profConflict.subject}" pour "${profConflict.classe}" ce ${slot.day} à ${slot.slot}.`,
      timestamp: nowStr,
      severity: 'high',
    });
  }

  // 3. Same Class/Promo Conflict
  const classConflict = allSlots.find(
    (s) => s.id !== slot.id && s.day === slot.day && s.slot === slot.slot && s.classe === slot.classe && (s.weekNumber || 1) === weekNumber
  );
  if (classConflict) {
    alerts.push({
      id: `err-class-${Date.now()}-${Math.random()}`,
      type: 'Classe',
      message: `La classe "${slot.classe}" a déjà un cours de "${classConflict.subject}" ce ${slot.day} à ${slot.slot}.`,
      timestamp: nowStr,
      severity: 'high',
    });
  }

  // 4. Room Capacity Constraint
  const targetRoom = INITIAL_ROOMS.find((r) => r.name === slot.room);
  if (targetRoom && slot.capacityRequired && targetRoom.capacity < slot.capacityRequired) {
    alerts.push({
      id: `err-cap-${Date.now()}-${Math.random()}`,
      type: 'Capacité',
      message: `Capacité insuffisante : "${slot.room}" dispose de ${targetRoom.capacity} places, mais le cours nécessite ${slot.capacityRequired} places.`,
      timestamp: nowStr,
      severity: 'medium',
    });
  }

  // 5. Teacher Maximum Work Hours Exceeded
  const teacherLimit = INITIAL_TEACHERS.find((t) => t.name === slot.prof);
  if (teacherLimit) {
    const totalHours = allSlots
      .filter((s) => s.prof === slot.prof && s.id !== slot.id)
      .reduce((sum) => sum + 2, 2); // each slot is 2h
    if (totalHours > teacherLimit.maxHours) {
      alerts.push({
        id: `err-quota-${Date.now()}-${Math.random()}`,
        type: 'Quota',
        message: `Dépassement d'heures : "${slot.prof}" atteint ${totalHours}h programmées (limite autorisée : ${teacherLimit.maxHours}h).`,
        timestamp: nowStr,
        severity: 'medium',
      });
    }
  }

  // 6. Teacher Hardcoded Availability (Sénégal universities mock)
  if (slot.prof === 'Dr. Diallo' && slot.day === 'Mercredi') {
    alerts.push({
      id: `err-avail-${Date.now()}-${Math.random()}`,
      type: 'Disponibilité',
      message: `Le Dr. Diallo n'est pas disponible le Mercredi (Séminaire de recherche national).`,
      timestamp: nowStr,
      severity: 'high',
    });
  }

  return alerts;
}

export function autoSuggestSubject(
  profName: string,
  className: string,
  associations: TeacherSubjectAssociation[]
): string | null {
  const match = associations.find((a) => a.prof === profName && a.classe === className);
  return match ? match.subject : null;
}
