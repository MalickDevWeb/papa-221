import { CoursItem } from '@/features/student/types';
import { parseTimeToMinutes } from '@/shared/utils/calendarHighlight';

/**
 * Checks if a course is on the current day and has already ended.
 */
export function isCoursePassedToday(course: CoursItem): boolean {
  const now = new Date();
  const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  const todayKey = days[now.getDay()];

  if (course.jour.toUpperCase() !== todayKey) {
    return false;
  }

  try {
    const parts = course.heure.split('-');
    if (parts.length < 2) return false;
    const endTimeStr = parts[1].trim();
    const endMinutes = parseTimeToMinutes(endTimeStr);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes >= endMinutes;
  } catch {
    return false;
  }
}
