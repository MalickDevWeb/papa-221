import type { CourseSession } from './CalendarData';

export interface NextCourseCountdown {
  readonly courseId: string;
  readonly label: string;
  readonly isToday: boolean;
  readonly isTomorrow: boolean;
  readonly formattedRemaining: string;
}

// Map day keys to weekday numbers (1 = Mon, 5 = Fri)
const DAY_MAP: Record<string, number> = {
  LUN: 1,
  MAR: 2,
  MER: 3,
  JEU: 4,
  VEN: 5,
};

export function getNextCourse(sessions: readonly CourseSession[], currentHourStr: string = "11:22"): NextCourseCountdown | null {
  if (sessions.length === 0) return null;

  // We simulate the current day as Wednesday (MER) to match the app's timeline
  const currentDayNum = 3; // MER
  const [currH, currM] = currentHourStr.split(':').map(Number);
  const currentTotalMinutes = currH * 60 + currM;

  let bestNext: CourseSession | null = null;
  let minDiffMinutes = Infinity;

  for (const s of sessions) {
    const dayNum = DAY_MAP[s.jour];
    if (!dayNum) continue;

    // Parse start time (e.g. "12:00 - 14:00" -> "12:00")
    const startStr = s.heure.split('-')[0].trim();
    const [startH, startM] = startStr.split(':').map(Number);
    const startTotalMinutes = startH * 60 + startM;

    // Calculate difference in days and minutes
    let dayDiff = dayNum - currentDayNum;
    
    // If same day but start time has already passed, treat it as next week
    if (dayDiff === 0 && startTotalMinutes <= currentTotalMinutes) {
      dayDiff = 7;
    } else if (dayDiff < 0) {
      dayDiff += 7;
    }

    const totalDiffMinutes = dayDiff * 24 * 60 + (startTotalMinutes - currentTotalMinutes);

    if (totalDiffMinutes < minDiffMinutes) {
      minDiffMinutes = totalDiffMinutes;
      bestNext = s;
    }
  }

  if (!bestNext) return null;

  const dayNum = DAY_MAP[bestNext.jour];
  const isToday = dayNum === currentDayNum && minDiffMinutes < 24 * 60;
  const isTomorrow = (dayNum === currentDayNum + 1) || (currentDayNum === 5 && dayNum === 1 && minDiffMinutes < 48 * 60);

  // Format remaining time
  let formattedRemaining: string;
  if (minDiffMinutes < 60) {
    formattedRemaining = `dans ${minDiffMinutes} min`;
  } else {
    const hours = Math.floor(minDiffMinutes / 60);
    const mins = minDiffMinutes % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remHours = hours % 24;
      formattedRemaining = `dans ${days} j et ${remHours} h`;
    } else if (mins === 0) {
      formattedRemaining = `dans ${hours} h`;
    } else {
      formattedRemaining = `dans ${hours} h ${mins} min`;
    }
  }

  const label = isToday 
    ? "Aujourd'hui" 
    : isTomorrow 
    ? "Demain" 
    : bestNext.jourNom;

  return {
    courseId: bestNext.id,
    label,
    isToday,
    isTomorrow,
    formattedRemaining,
  };
}
