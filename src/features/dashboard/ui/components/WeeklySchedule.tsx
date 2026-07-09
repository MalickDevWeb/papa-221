import React, { useState } from 'react';
import { COURS_DATA_DASHBOARD } from '@/features/student/data/mockCourses';
import { MobileScheduleView } from './MobileScheduleView';
import { DesktopFocusView } from './DesktopFocusView';
import { DesktopAllView } from './DesktopAllView';
import { CoursItem } from '@/features/student/types';
import { parseTimeToMinutes } from '@/shared/utils/calendarHighlight';

interface WeeklyScheduleProps {
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

  const currentDayCourses = getCoursesForDay(selectedDay, COURS_DATA_DASHBOARD);

  return (
    <section className="col-span-12 bg-white/95 backdrop-blur-md border border-neutral-gray-200 rounded-3xl p-5 shadow-sm overflow-hidden flex flex-col justify-between gap-4">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="font-title-lg text-xs font-black flex items-center gap-1.5 text-[#291715] uppercase tracking-wide">
          <span translate="no" className="material-symbols-outlined text-brand-red-deep text-lg">calendar_month</span>
          Emploi du temps
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/50">
            <button
              onClick={() => setViewMode('focus')}
              className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-md transition-colors cursor-pointer ${
                viewMode === 'focus' ? 'bg-white text-brand-red-deep shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Focus (3 jours)
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-md transition-colors cursor-pointer ${
                viewMode === 'all' ? 'bg-white text-brand-red-deep shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Semaine Complète
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600 transition-colors cursor-pointer flex items-center justify-center"
              title="Jour précédent"
            >
              <span translate="no" className="material-symbols-outlined text-sm font-bold">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600 transition-colors cursor-pointer flex items-center justify-center"
              title="Jour suivant"
            >
              <span translate="no" className="material-symbols-outlined text-sm font-bold">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

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
            selectedDay={selectedDay}
            onSelectCourse={onSelectCourse}
            enCoursId={enCoursId}
            prochainId={prochainId}
            daysOrder={DAYS_ORDER}
          />
        ) : (
          <DesktopAllView
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
