import React from 'react';
import { CoursItem } from '@/features/student/types';
import { DesktopDayColumn } from './DesktopDayColumn';
import { parseTimeToMinutes } from '@/shared/utils/calendarHighlight';

interface DesktopFocusViewProps {
  readonly courses: CoursItem[];
  readonly selectedDay: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM';
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

export function DesktopFocusView({
  courses,
  selectedDay,
  onSelectCourse,
  enCoursId,
  prochainId,
  daysOrder
}: DesktopFocusViewProps) {
  const currentIndex = daysOrder.findIndex(d => d.key === selectedDay);
  const nextIndex = (currentIndex + 1) % daysOrder.length;
  const afterNextIndex = (currentIndex + 2) % daysOrder.length;

  const currentKey = daysOrder[currentIndex].key;
  const nextKey = daysOrder[nextIndex].key;
  const afterNextKey = daysOrder[afterNextIndex].key;

  return (
    <div className="grid grid-cols-3 gap-3 xl:gap-4.5 items-stretch select-none animate-fade-in">
      <DesktopDayColumn
        dayKey={currentKey}
        dayName={`Aujourd'hui (${daysOrder[currentIndex].name})`}
        courses={getCoursesForDay(currentKey, courses)}
        onSelectCourse={onSelectCourse}
        enCoursId={enCoursId}
        prochainId={prochainId}
      />
      <DesktopDayColumn
        dayKey={nextKey}
        dayName={`Demain (${daysOrder[nextIndex].name})`}
        courses={getCoursesForDay(nextKey, courses)}
        onSelectCourse={onSelectCourse}
        enCoursId={enCoursId}
        prochainId={prochainId}
      />
      <DesktopDayColumn
        dayKey={afterNextKey}
        dayName={`Après-Demain (${daysOrder[afterNextIndex].name})`}
        courses={getCoursesForDay(afterNextKey, courses)}
        onSelectCourse={onSelectCourse}
        enCoursId={enCoursId}
        prochainId={prochainId}
      />
    </div>
  );
}
