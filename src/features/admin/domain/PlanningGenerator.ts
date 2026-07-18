import { CalendarSlot, UnassignedCourse, DAYS, SLOTS } from './PlanningModels';
import { checkSchedulingConflicts } from './PlanningRulesEngine';

export function generateOptimizedSchedule(
  unassigned: UnassignedCourse[],
  existingSlots: CalendarSlot[],
  weekNumber: number
): { readonly assigned: CalendarSlot[]; readonly remaining: UnassignedCourse[] } {
  const resultSlots: CalendarSlot[] = [...existingSlots];
  const assignedSlots: CalendarSlot[] = [];
  const remaining: UnassignedCourse[] = [];

  for (const course of unassigned) {
    let placed = false;

    // Search for a conflict-free day & slot & room combination
    for (const day of DAYS) {
      if (placed) break;
      for (const slotTime of SLOTS) {
        if (placed) break;

        const candidate: CalendarSlot = {
          id: `slot-ai-${Date.now()}-${Math.random()}`,
          subject: course.subject,
          prof: course.prof,
          room: course.room,
          classe: course.classe,
          day,
          slot: slotTime,
          type: course.type,
          faculte: course.faculte,
          departement: course.departement,
          filiere: course.filiere,
          niveau: course.niveau,
          semestre: 'Semestre 1',
          anneeAcademique: '2025-2026',
          groupe: 'Aucun',
          building: course.room.includes('Amphi') ? 'Bâtiment Central' : 'Bâtiment B',
          capacityRequired: course.capacityRequired,
          isPublished: false,
          weekNumber
        };

        const conflicts = checkSchedulingConflicts(candidate, resultSlots, weekNumber);
        if (conflicts.length === 0) {
          resultSlots.push(candidate);
          assignedSlots.push(candidate);
          placed = true;
        }
      }
    }

    if (!placed) {
      remaining.push(course);
    }
  }

  return { assigned: assignedSlots, remaining };
}
