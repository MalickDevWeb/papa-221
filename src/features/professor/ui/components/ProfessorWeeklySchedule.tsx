import React, { useState, useMemo } from 'react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { ProfessorWeeklyDayCard } from './ProfessorWeeklyDayCard';
import { ProfessorMobileSchedule } from './ProfessorMobileSchedule';
import { getHighlightState } from '@/shared/utils/calendarHighlight';

interface Props {
  readonly schedule: readonly ProfessorSchedule[];
  readonly onEnterCourse?: (courseId: string) => void;
}

const DAYS = [
  { key: 'Lundi', short: 'LUN' },
  { key: 'Mardi', short: 'MAR' },
  { key: 'Mercredi', short: 'MER' },
  { key: 'Jeudi', short: 'JEU' },
  { key: 'Vendredi', short: 'VEN' }
] as const;

export function ProfessorWeeklySchedule({ schedule, onEnterCourse }: Props) {
  const { enCoursId, prochainId, initialDay } = useMemo(() => {
    const mapped = schedule.map(s => {
      const [start, end] = s.time.split('-').map(str => str.trim());
      return { id: s.id, day: s.day, startTime: start || '', endTime: end || '' };
    });
    const state = getHighlightState(mapped);
    const target = schedule.find(s => s.id === (state.enCoursId || state.prochainId));
    return { ...state, initialDay: target?.day || 'Mercredi' };
  }, [schedule]);

  const [selectedDay, setSelectedDay] = useState<string>(initialDay);

  return (
    <section className="bg-white border border-neutral-200/90 rounded-[32px] p-5 md:p-6.5 shadow-xl hover:shadow-2xl transition-all duration-350 flex flex-col min-h-[365px] md:h-[365px] justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#B3181C] via-[#8e1215] to-[#B3181C]" />
      <div className="flex justify-between items-center mb-4.5 shrink-0">
        <h3 className="font-sans text-[13.5px] font-black flex items-center gap-2.5 text-neutral-800">
          <span translate="no" className="material-symbols-outlined text-[#B3181C] scale-105">calendar_month</span>
          Mon Emploi du Temps
        </h3>
        <span className="font-extrabold text-[9.5px] tracking-wider uppercase bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10 px-3 py-1 rounded-xl">Semaine Courante</span>
      </div>

      <ProfessorMobileSchedule
        DAYS={DAYS}
        schedule={schedule}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        enCoursId={enCoursId}
        prochainId={prochainId}
        onEnterCourse={onEnterCourse}
      />

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto w-full pb-1.5 scrollbar-thin">
        <div className="grid grid-cols-5 gap-5 min-w-[980px] xl:min-w-0 items-stretch select-none pl-0 pr-0 pt-[9px] pb-[9px]">
          {DAYS.map((dayObj) => {
            const daySessions = schedule.filter(s => s.day === dayObj.key && s.status !== 'annule');
            return (
              <ProfessorWeeklyDayCard
                key={dayObj.key}
                dayKey={dayObj.key}
                sessions={daySessions}
                enCoursId={enCoursId}
                prochainId={prochainId}
                onEnterCourse={onEnterCourse}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
