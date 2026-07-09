import { parseTimeToMinutes } from './calendarHighlight';

export interface GenericCourseItem {
  id: string;
  jour: string;
  heure: string;
}

export function getBestCourseForDay<T extends GenericCourseItem>(
  day: string,
  courses: T[],
  enCoursId: string | null,
  prochainId: string | null
): T | undefined {
  const dayCourses = courses.filter(c => c.jour.toUpperCase() === day.toUpperCase());
  if (dayCourses.length === 0) return undefined;

  // 1. Check if any course of this day is the current active course
  if (enCoursId) {
    const active = dayCourses.find(c => c.id === enCoursId);
    if (active) return active;
  }

  // 2. Check if any course of this day is the next upcoming course (global prochainId)
  if (prochainId) {
    const next = dayCourses.find(c => c.id === prochainId);
    if (next) return next;
  }

  // 3. If there are multiple schedules on this day, point to the one that is in progress or next, never a passed one.
  const now = new Date();
  const DAYS_MAP_SHORT: Record<string, number> = { LUN: 1, MAR: 2, MER: 3, JEU: 4, VEN: 5, SAM: 6 };
  const currentDay = now.getDay(); // 1 = Monday, ..., 5 = Friday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (DAYS_MAP_SHORT[day.toUpperCase()] === currentDay) {
    const futureOrActiveCourses = dayCourses.filter(c => {
      const parts = c.heure.split('-');
      const endStr = parts[1] ? parts[1].trim() : '';
      return parseTimeToMinutes(endStr) > currentMinutes;
    });

    if (futureOrActiveCourses.length > 0) {
      // Sort them by start time ascending to get the earliest non-passed one
      return futureOrActiveCourses.sort((a, b) => {
        const startA = parseTimeToMinutes(a.heure.split('-')[0].trim());
        const startB = parseTimeToMinutes(b.heure.split('-')[0].trim());
        return startA - startB;
      })[0];
    }
    // If all courses of today have ended, show the last one of the day
    return dayCourses[dayCourses.length - 1];
  }

  // 4. For other days, just return the first course of that day
  return dayCourses[0];
}
