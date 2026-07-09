import React from 'react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { ProfessorCompactSessionItem } from './ProfessorCompactSessionItem';

interface Props {
  readonly dayKey: string;
  readonly sessions: readonly ProfessorSchedule[];
  readonly enCoursId: string | null;
  readonly prochainId: string | null;
  readonly onEnterCourse?: (courseId: string) => void;
}

export function ProfessorWeeklyDayCard({ dayKey, sessions, enCoursId, prochainId, onEnterCourse }: Props) {
  const isToday = dayKey === ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][new Date().getDay()];
  const isEnCours = sessions.some(s => s.id === enCoursId);
  const isProchain = sessions.some(s => s.id === prochainId);

  return (
    <div 
      className={`p-3.5 sm:p-4 rounded-[22px] border flex flex-col justify-between transition-all duration-350 relative select-none h-full min-h-[225px] ${
        isEnCours 
          ? 'bg-[#FFF5F5]/95 border-[#B3181C] shadow-lg shadow-[#B3181C]/10 ring-2 ring-[#B3181C]/30 scale-[1.03] z-10' 
          : isProchain
            ? 'bg-amber-50/55 border-amber-500/55 shadow-md ring-2 ring-amber-500/20 scale-[1.01]'
            : isToday 
              ? 'bg-gradient-to-b from-white to-[#FFF8F8] border-[#B3181C]/35 shadow-sm ring-1 ring-[#B3181C]/5' 
              : 'bg-white border-neutral-200 hover:bg-[#FFF9F9]/40 hover:border-[#B3181C]/20 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col flex-grow h-full overflow-hidden">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-100/75 shrink-0">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isEnCours || isToday ? 'text-[#B3181C]' : isProchain ? 'text-amber-600' : 'text-neutral-400'}`}>
            {dayKey}
          </span>
          <div className="flex items-center gap-1">
            {isEnCours && (
              <span className="flex items-center gap-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#B3181C] text-white uppercase tracking-wider animate-pulse">
                <span className="w-1 h-1 rounded-full bg-white inline-block animate-ping" />
                Live
              </span>
            )}
            {isProchain && (
              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider">
                Suivant
              </span>
            )}
            {isToday && !isEnCours && !isProchain && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#B3181C] animate-ping" />
            )}
          </div>
        </div>

        {sessions.length > 0 ? (
          sessions.length === 1 ? (
            <ProfessorCompactSessionItem
              session={sessions[0]}
              isEnCours={sessions[0].id === enCoursId}
              isProchain={sessions[0].id === prochainId}
              onEnterCourse={onEnterCourse}
              variant="full"
            />
          ) : (
            <div className="flex-grow flex flex-col gap-1.5 overflow-y-auto max-h-[185px] pr-0.5 no-scrollbar">
              {sessions.map((session) => (
                <ProfessorCompactSessionItem
                  key={session.id}
                  session={session}
                  isEnCours={session.id === enCoursId}
                  isProchain={session.id === prochainId}
                  onEnterCourse={onEnterCourse}
                  variant="compact"
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-300 flex-grow">
            <span translate="no" className="material-symbols-outlined text-base">calendar_today</span>
            <span className="text-[9px] font-black uppercase tracking-wider mt-1.5">Libre</span>
          </div>
        )}
      </div>

      {sessions.length === 1 && (
        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100/50 min-w-0 gap-1 shrink-0">
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
            sessions[0].type === 'CM' ? 'bg-blue-50 text-blue-600 border border-blue-100' : sessions[0].type === 'TP' ? 'bg-emerald-50 text-[#137333]' : 'bg-amber-50 text-amber-600'
          }`}>{sessions[0].type}</span>
          <span className="text-[8.5px] font-black text-emerald-600 truncate shrink bg-emerald-50/50 px-1.5 py-0.5 rounded-md border border-emerald-100/50">Confirmé</span>
        </div>
      )}
      {sessions.length > 1 && (
        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100/50 min-w-0 gap-1 shrink-0">
          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md shrink-0 bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10">
            {sessions.length} Séances
          </span>
          <span className="text-[8px] font-bold text-neutral-400">Faire défiler</span>
        </div>
      )}
    </div>
  );
}
