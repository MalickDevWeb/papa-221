import React, { useState } from 'react';
import { CoursItem } from '@/features/student/types';
import { LiveIndicator } from '@/shared/components';
import { isCoursePassedToday } from '@/features/dashboard/utils/scheduleFilter';

interface MobileProps {
  readonly selectedDay: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM';
  readonly setSelectedDay: (day: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM') => void;
  readonly courses: CoursItem[];
  readonly onSelectCourse: (course: CoursItem) => void;
  readonly enCoursId: string | null;
  readonly prochainId: string | null;
}

export function MobileScheduleView({
  selectedDay,
  setSelectedDay,
  courses,
  onSelectCourse,
  enCoursId,
  prochainId
}: MobileProps) {
  const isToday = selectedDay === ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'][new Date().getDay()];
  const [showPassed, setShowPassed] = useState(false);

  const passed = isToday ? courses.filter(isCoursePassedToday) : [];
  const active = isToday ? courses.filter(c => !isCoursePassedToday(c)) : courses;
  const visible = showPassed ? [...passed, ...active] : active;

  return (
    <div className="block md:hidden w-full space-y-3">
      <div className="grid grid-cols-6 gap-1 shrink-0">
        {(['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'] as const).map((day) => (
          <button
            key={day}
            onClick={() => { setSelectedDay(day); setShowPassed(false); }}
            className={`py-1.5 px-1 text-center font-black text-xs rounded-xl transition-all duration-250 cursor-pointer ${
              selectedDay === day
                ? 'bg-brand-red-deep text-white shadow-md shadow-brand-red-deep/15 scale-102'
                : 'bg-neutral-gray-50 border border-neutral-gray-150 text-secondary hover:bg-neutral-100'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="min-h-[100px] flex flex-col justify-center gap-2.5">
        {visible.length === 0 ? (
          <p className="text-center text-xs text-secondary py-3">Aucun cours prévu</p>
        ) : (
          visible.map((course) => {
            const isPassed = isCoursePassedToday(course);
            const isEnCours = course.id === enCoursId;
            const isProchain = course.id === prochainId;

            return (
              <div 
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow hover:scale-101 group relative ${
                  isPassed
                    ? 'bg-neutral-50/50 border-neutral-200/50 opacity-45'
                    : isEnCours 
                      ? 'bg-brand-red-light/75 border-brand-red-deep/50 shadow-md ring-2 ring-brand-red-deep/20 animate-pulse' 
                      : isProchain
                        ? 'bg-amber-50 border-amber-500/50 shadow-md ring-2 ring-amber-500/10'
                        : 'bg-neutral-50/50 border-neutral-gray-200 hover:border-brand-red-deep/25'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[9.5px] font-black uppercase tracking-widest ${
                    isPassed ? 'text-neutral-400' : isEnCours ? 'text-brand-red-deep' : isProchain ? 'text-amber-600' : 'text-neutral-500'
                  }`}>{course.heure}</span>
                  {isPassed ? (
                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-neutral-100 text-neutral-400 border border-neutral-200">
                      Terminé
                    </span>
                  ) : isEnCours || isProchain ? (
                    <LiveIndicator status={isEnCours ? 'en-cours' : 'prochain'} size="sm" />
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-md text-[8.5px] font-black uppercase flex items-center gap-1.5 bg-neutral-gray-200 text-[#291715]">
                      {course.type}
                    </span>
                  )}
                </div>
                
                <h4 className={`font-black text-xs mb-1 transition-colors ${
                  isPassed ? 'text-neutral-400 line-through' : 'text-on-surface group-hover:text-brand-red-deep'
                }`}>
                  {course.nom}
                </h4>
                
                <div className="flex items-center justify-between text-[11px] text-secondary">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span translate="no" className="material-symbols-outlined text-xs text-brand-red-deep">location_on</span>
                    <span>{course.salle}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="truncate max-w-[130px] font-heavy text-neutral-500">{course.professeur}</span>
                  </div>
                  <span translate="no" className="material-symbols-outlined text-xs text-brand-red-deep group-hover:translate-x-0.5 transition-all">arrow_forward</span>
                </div>
              </div>
            );
          })
        )}

        {passed.length > 0 && (
          <button
            onClick={() => setShowPassed(!showPassed)}
            className="text-xs font-bold text-neutral-500 hover:text-brand-red-deep py-2 text-center border border-dashed border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors"
          >
            {showPassed ? 'Masquer les cours passés' : `Afficher les ${passed.length} cours passés`}
          </button>
        )}
      </div>
    </div>
  );
}
