import React, { useState } from 'react';
import { CoursItem } from '@/features/student/types';
import { LiveIndicator } from '@/shared/components';
import { isCoursePassedToday } from '@/features/dashboard/utils/scheduleFilter';

interface ColumnProps {
  readonly dayKey: string;
  readonly dayName: string;
  readonly courses: CoursItem[];
  readonly onSelectCourse: (course: CoursItem) => void;
  readonly enCoursId: string | null;
  readonly prochainId: string | null;
}

export function DesktopDayColumn({ dayKey, dayName, courses, onSelectCourse, enCoursId, prochainId }: ColumnProps) {
  const isToday = dayKey === ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'][new Date().getDay()];
  const [showPassed, setShowPassed] = useState(false);
  const passed = isToday ? courses.filter(isCoursePassedToday) : [];
  const active = isToday ? courses.filter(c => !isCoursePassedToday(c)) : courses;
  const visible = showPassed ? [...passed, ...active] : active;

  return (
    <div className="flex flex-col gap-2 flex-grow min-w-0">
      <div className="flex items-center justify-between px-1 pb-1 border-b border-neutral-100/70 min-w-0">
        <span 
          title={dayName}
          className={`text-[8.5px] xl:text-[10px] font-black uppercase tracking-wider truncate block w-full ${isToday ? 'text-brand-red-deep' : 'text-neutral-500'}`}
        >
          {dayName}
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-grow overflow-y-visible pr-1">
        {visible.length > 0 ? (
          visible.map((course) => {
            const isPassed = isCoursePassedToday(course);
            const isEnCours = course.id === enCoursId;
            const isProchain = course.id === prochainId;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className={`p-2 lg:p-2 xl:p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-300 h-[104px] cursor-pointer group shrink-0 overflow-hidden ${
                  isPassed
                    ? 'bg-neutral-50/40 border-neutral-200/50 opacity-50 hover:opacity-100 hover:border-neutral-300'
                    : isEnCours
                      ? 'bg-white border-l-4 border-l-brand-red-deep border-y-brand-red-deep/30 border-r-brand-red-deep/30 shadow-[0_6px_20px_rgba(179,24,28,0.08)] scale-[1.01] z-10 ring-1 ring-brand-red-deep/10'
                      : isProchain
                        ? 'bg-white border-l-4 border-l-amber-500 border-y-amber-500/20 border-r-amber-500/20 shadow-[0_4px_12px_rgba(245,158,11,0.05)]'
                        : 'bg-white border-neutral-200 hover:bg-[#FFF8F7]/20 hover:border-brand-red-deep/20 hover:shadow-[0_4px_12px_rgba(179,24,28,0.02)] hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-1 flex-wrap">
                  <span className={`text-[7.5px] xl:text-[8px] font-extrabold font-mono tracking-tight xl:tracking-normal shrink-0 ${isPassed ? 'text-neutral-400' : isEnCours ? 'text-brand-red-deep font-black' : isProchain ? 'text-amber-600 font-black' : 'text-neutral-500 font-bold'}`}>
                    {course.heure}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {isPassed ? (
                      <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-400 border border-neutral-200/60 uppercase tracking-wider">TERMINE</span>
                    ) : (
                      <>
                        <LiveIndicator status={isEnCours ? 'en-cours' : isProchain ? 'prochain' : 'none'} size="sm" />
                        {!isEnCours && !isProchain && (
                          <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded-md shrink-0 border uppercase tracking-wider ${
                            course.type === 'CM' ? 'bg-blue-50/80 text-blue-600 border-blue-100/60' : course.type === 'TP' ? 'bg-emerald-50/80 text-emerald-600 border-emerald-100/60' : 'bg-amber-50/80 text-amber-600 border-amber-100/60'
                          }`}>{course.type}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <h4 
                  title={course.nom}
                  className={`text-[8.5px] lg:text-[9px] xl:text-[9.5px] font-extrabold leading-tight tracking-tight line-clamp-2 transition-colors duration-250 flex-grow break-words overflow-hidden ${isPassed ? 'text-neutral-400 line-through' : isEnCours ? 'text-brand-red-deep group-hover:text-black font-black' : isProchain ? 'text-amber-900 group-hover:text-amber-700' : 'text-[#291715] group-hover:text-brand-red-deep'}`}
                >
                  {course.nom}
                </h4>

                <div className="text-[8px] text-neutral-400 font-extrabold uppercase tracking-wider truncate mt-1 flex items-center gap-1 shrink-0">
                  <span className={`shrink-0 ${isEnCours ? 'text-brand-red-deep/80' : isProchain ? 'text-amber-600/80' : 'text-neutral-500'}`}>{course.salle}</span>
                  <span className="text-neutral-300">•</span>
                  <span className="truncate font-medium text-neutral-500">{course.professeur.replace(/^(Dr\.|Mme\.|M\.)\s*/, '')}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-neutral-gray-300 bg-neutral-50/40 border border-dashed border-neutral-gray-200 rounded-xl h-[104px] shrink-0">
            <span translate="no" className="material-symbols-outlined text-xs">event_busy</span>
            <span className="text-[7.5px] font-bold mt-0.5">Aucun cours</span>
          </div>
        )}

        {passed.length > 0 && (
          <button
            onClick={() => setShowPassed(!showPassed)}
            className="text-[8px] font-extrabold text-neutral-400 hover:text-brand-red-deep py-1 text-center border border-dashed border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors"
          >
            {showPassed ? '- Masquer les cours passés' : `+ ${passed.length} cours passé${passed.length > 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
}
