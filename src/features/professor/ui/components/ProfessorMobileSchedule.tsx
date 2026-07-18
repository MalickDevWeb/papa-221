import React from 'react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { formatTimeRange, formatRoomName } from '../../utils/scheduleFormatter';

interface Props {
  readonly DAYS: ReadonlyArray<{ readonly key: string; readonly short: string }>;
  readonly schedule: ReadonlyArray<ProfessorSchedule>;
  readonly selectedDay: string;
  readonly setSelectedDay: (day: string) => void;
  readonly enCoursId: string | null;
  readonly prochainId: string | null;
  readonly onEnterCourse?: (courseId: string) => void;
}

export function ProfessorMobileSchedule({
  DAYS,
  schedule,
  selectedDay,
  setSelectedDay,
  enCoursId,
  prochainId,
  onEnterCourse,
}: Props) {
  const activeSessions = schedule.filter(s => s.day === selectedDay && s.status !== 'annule');

  return (
    <div className="block md:hidden w-full space-y-4">
      <div className="grid grid-cols-5 gap-1.5 shrink-0">
        {DAYS.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`py-2 px-1 text-center font-black text-xs rounded-xl transition-all cursor-pointer border-0 ${
              selectedDay === d.key ? 'bg-[#B3181C] text-white shadow-md' : 'bg-neutral-gray-50 border border-neutral-gray-150 text-secondary'
            }`}
          >
            {d.short}
          </button>
        ))}
      </div>

      <div className="flex-grow flex flex-col justify-start min-h-[140px] max-h-[350px] overflow-y-auto pr-0.5 no-scrollbar gap-3">
        {activeSessions.length === 0 ? (
          <p className="text-center text-xs text-secondary py-8">Aucun cours prévu</p>
        ) : (
          activeSessions.map((session) => {
            const { display: activeTimeDisplay } = formatTimeRange(session.time);
            const activeRoomDisplay = formatRoomName(session.room);
            const isEnCours = session.id === enCoursId;
            const isProchain = session.id === prochainId;

            return (
              <div 
                key={session.id}
                onClick={() => onEnterCourse?.(session.courseId || session.id)}
                style={{
                  width: '273.451px',
                  height: '112.832px',
                  marginLeft: '22px',
                }}
                className={`p-4 rounded-2xl border cursor-pointer hover:shadow-md hover:scale-[1.01] group transition-all duration-300 flex flex-col justify-between shrink-0 ${
                  isEnCours 
                    ? 'bg-[#FFF5F5] border-[#B3181C]/40 shadow-sm ring-2 ring-[#B3181C]/5' 
                    : isProchain
                      ? 'bg-amber-50/60 border-amber-500/30 shadow-sm ring-2 ring-amber-500/5'
                      : 'bg-neutral-50/60 border-neutral-200 hover:bg-white hover:border-[#B3181C]/20 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-lg border ${isEnCours ? 'bg-white text-[#B3181C] border-[#B3181C]/15' : isProchain ? 'bg-white text-amber-600 border-amber-500/15' : 'bg-white text-neutral-500 border-neutral-200'}`}>
                    {activeTimeDisplay}
                  </span>
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 ${isEnCours ? 'bg-[#B3181C] text-white animate-pulse' : isProchain ? 'bg-amber-500 text-white' : 'bg-neutral-200 text-[#291715]'}`}>
                      {isEnCours && <span className="w-1 h-1 rounded-full bg-white animate-ping shrink-0" />}{isEnCours ? 'En cours' : isProchain ? 'Prochain' : session.type}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-[13px] text-neutral-800 group-hover:text-[#B3181C] transition-colors truncate">
                    {session.classe || 'L3-GL'}
                  </h4>
                  <p className="text-[10.5px] text-neutral-400 font-extrabold leading-tight truncate mb-2">
                    {session.courseTitle}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold">
                  <div className="flex items-center gap-1.5">
                    <span translate="no" className={`material-symbols-outlined text-sm ${isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-500' : 'text-[#B3181C]'}`}>
                      location_on
                    </span>
                    <span>{activeRoomDisplay}</span>
                  </div>
                  <span translate="no" className={`material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1 ${isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-500' : 'text-[#B3181C]'}`}>
                    arrow_forward
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
