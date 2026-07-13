import React from 'react';
import { CoursItem } from '@/features/student/types';
import { DesktopDayColumn } from './DesktopDayColumn';
import { parseTimeToMinutes } from '@/shared/utils/calendarHighlight';

interface DesktopAllViewProps {
  readonly courses: CoursItem[];
  readonly onSelectCourse: (course: CoursItem) => void;
  readonly enCoursId: string | null;
  readonly prochainId: string | null;
  readonly daysOrder: readonly { readonly key: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM'; readonly name: string }[];
}

function getCoursesForDay(day: string, courses: CoursItem[]): CoursItem[] {
  return courses
    .filter((c) => c.jour.toUpperCase() === day.toUpperCase())
    .sort((a, b) => {
      const startA = parseTimeToMinutes(a.heure.split('-')[0].trim());
      const startB = parseTimeToMinutes(b.heure.split('-')[0].trim());
      return startA - startB;
    });
}

export function DesktopAllView({
  courses,
  onSelectCourse,
  enCoursId,
  prochainId,
  daysOrder
}: DesktopAllViewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar select-none animate-fade-in">
      {daysOrder.map((dayObj) => (
        <div key={dayObj.key} className="flex-1 min-w-[190px]">
          <DesktopDayColumn
            dayKey={dayObj.key}
            dayName={dayObj.name}
            courses={getCoursesForDay(dayObj.key, courses)}
            onSelectCourse={onSelectCourse}
            enCoursId={enCoursId}
            prochainId={prochainId}
          />
        </div>
      ))}
    </div>
  );
}
