import React, { useState } from 'react';
import { MobileScheduleView } from './MobileScheduleView';
import { DesktopFocusView } from './DesktopFocusView';
import { DesktopAllView } from './DesktopAllView';
import { WeeklyScheduleHeader } from './WeeklyScheduleHeader';
import { CoursItem } from '@/features/student/types';
import { parseTimeToMinutes } from '@/shared/utils/calendarHighlight';

interface WeeklyScheduleProps {
  readonly courses: CoursItem[];
  readonly selectedDay: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM';
  readonly setSelectedDay: (day: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM') => void;
  readonly onSelectCourse: (course: CoursItem) => void;
  readonly enCoursId: string | null;
  readonly prochainId: string | null;
}

const DAYS_ORDER = [
  { key: 'LUN', name: 'Lundi' },
  { key: 'MAR', name: 'Mardi' },
  { key: 'MER', name: 'Mercredi' },
  { key: 'JEU', name: 'Jeudi' },
  { key: 'VEN', name: 'Vendredi' },
  { key: 'SAM', name: 'Samedi' }
] as const;

function getCoursesForDay(day: string, courses: CoursItem[]): CoursItem[] {
  return courses
    .filter((c) => c.jour.toUpperCase() === day.toUpperCase())
    .sort((a, b) => {
      const startA = parseTimeToMinutes(a.heure.split('-')[0].trim());
      const startB = parseTimeToMinutes(b.heure.split('-')[0].trim());
      return startA - startB;
    });
}

export function WeeklySchedule({
  courses,
  selectedDay,
  setSelectedDay,
  onSelectCourse,
  enCoursId,
  prochainId
}: WeeklyScheduleProps) {
  const [viewMode, setViewMode] = useState<'focus' | 'all'>('focus');

  const currentIndex = DAYS_ORDER.findIndex(d => d.key === selectedDay);
  const nextIndex = (currentIndex + 1) % DAYS_ORDER.length;
  const prevIndex = (currentIndex - 1 + DAYS_ORDER.length) % DAYS_ORDER.length;

  const handleNext = () => setSelectedDay(DAYS_ORDER[nextIndex].key);
  const handlePrev = () => setSelectedDay(DAYS_ORDER[prevIndex].key);

  const currentDayCourses = getCoursesForDay(selectedDay, courses);

  return (
    <section className="col-span-12 bg-white border border-neutral-gray-200 rounded-3xl p-5 shadow-sm overflow-hidden flex flex-col justify-between gap-4">
      <WeeklyScheduleHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <MobileScheduleView
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        courses={currentDayCourses}
        onSelectCourse={onSelectCourse}
        enCoursId={enCoursId}
        prochainId={prochainId}
      />

      <div className="hidden md:block w-full">
        {viewMode === 'focus' ? (
          <DesktopFocusView
            courses={courses}
            selectedDay={selectedDay}
            onSelectCourse={onSelectCourse}
            enCoursId={enCoursId}
            prochainId={prochainId}
            daysOrder={DAYS_ORDER}
          />
        ) : (
          <DesktopAllView
            courses={courses}
            onSelectCourse={onSelectCourse}
            enCoursId={enCoursId}
            prochainId={prochainId}
            daysOrder={DAYS_ORDER}
          />
        )}
      </div>
    </section>
  );
}
