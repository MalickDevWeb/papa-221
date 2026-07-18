export interface HighlightableCourse {
  readonly id: string;
  readonly day: string;
  readonly startTime: string;
  readonly endTime: string;
}

const DAY_MAP: Record<string, number> = {
  lun: 1, lundi: 1,
  mar: 2, mardi: 2,
  mer: 3, mercredi: 3,
  jeu: 4, jeudi: 4,
  ven: 5, vendredi: 5,
  sam: 6, samedi: 6,
};

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function getHighlightState(courses: readonly HighlightableCourse[]) {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let enCoursId: string | null = null;
  let prochainId: string | null = null;

  const todayCourses = courses.filter(c => DAY_MAP[c.day.toLowerCase()] === currentDay);
  
  const activeCourse = todayCourses.find(c => {
    const start = parseTimeToMinutes(c.startTime);
    const end = parseTimeToMinutes(c.endTime);
    return currentMinutes >= start && currentMinutes < end;
  });

  if (activeCourse) {
    enCoursId = activeCourse.id;
  }

  const upcomingToday = todayCourses
    .filter(c => parseTimeToMinutes(c.startTime) > currentMinutes)
    .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));

  if (upcomingToday.length > 0) {
    prochainId = upcomingToday[0].id;
  } else {
    let minDiff = 99999;
    let bestCourse: HighlightableCourse | null = null;

    for (const c of courses) {
      const targetDay = DAY_MAP[c.day.toLowerCase()];
      if (!targetDay) continue;

      let dayDiff = targetDay - currentDay;
      if (dayDiff <= 0) {
        dayDiff += 7;
      }

      const minutesDiff = dayDiff * 24 * 60 + parseTimeToMinutes(c.startTime) - currentMinutes;
      if (minutesDiff < minDiff) {
        minDiff = minutesDiff;
        bestCourse = c;
      }
    }

    if (bestCourse) {
      prochainId = bestCourse.id;
    }
  }

  return { enCoursId, prochainId };
}
