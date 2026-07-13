import React from 'react';
import { MapPin, Clock, User, Play, Compass } from 'lucide-react';
import type { CourseSession } from './CalendarData';
import type { NextCourseCountdown } from './CalendarUtils';

interface CardProps {
  readonly dayKey: string;
  readonly dayName: string;
  readonly session: CourseSession | undefined;
  readonly isToday: boolean;
  readonly nextCourse: NextCourseCountdown | null;
  readonly onSelect: (session: CourseSession) => void;
}

export function WeeklyCard({ dayKey, dayName, session, isToday, nextCourse, onSelect }: CardProps) {
  const isDirect = session?.enCours;
  const isNext = nextCourse && session && nextCourse.courseId === session.id && !isDirect;

  return (
    <div
      id={`calendar-card-${dayKey}`}
      data-today={isToday ? 'true' : 'false'}
      data-direct={isDirect ? 'true' : 'false'}
      data-next={isNext ? 'true' : 'false'}
      onClick={() => session && onSelect(session)}
      className={`p-4 rounded-[22px] border flex flex-col justify-between transition-all duration-300 select-none relative group shadow-[0_2px_10px_rgba(0,0,0,0.01)] ${
        isDirect ? 'bg-gradient-to-b from-[#FFFDFD] to-[#FFF5F5] border-[#B3181C] ring-2 ring-[#B3181C]/5 cursor-pointer shadow-md'
        : isNext ? 'bg-gradient-to-b from-white to-amber-50/5 border-amber-500 ring-2 ring-amber-500/5 cursor-pointer shadow-sm hover:border-amber-500/70'
        : isToday ? 'bg-white border-[#B3181C]/45 shadow-sm cursor-pointer hover:border-[#B3181C]/70'
        : session ? 'bg-white border-neutral-200/90 hover:border-[#B3181C]/20 hover:shadow-md cursor-pointer'
        : 'bg-neutral-50/50 border-neutral-200/40 cursor-default'
      } active:scale-[0.98]`}
    >
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
          <div className="flex flex-col">
            <span className={`text-[10.5px] font-black uppercase tracking-wider ${
              isDirect || isToday ? 'text-[#B3181C]' : isNext ? 'text-amber-600' : 'text-neutral-500'
            }`}>
              {dayName}
            </span>
            {isToday && (
              <span className="text-[8.5px] font-bold text-neutral-400 lowercase leading-none mt-0.5">(aujourd&apos;hui)</span>
            )}
          </div>
          {(isDirect || isNext) && (
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDirect ? 'bg-[#B3181C]' : 'bg-amber-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isDirect ? 'bg-[#B3181C]' : 'bg-amber-500'}`} />
            </span>
          )}
        </div>

        {session ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-neutral-450 shrink-0" />
              <span className={`text-[10px] font-extrabold ${isDirect ? 'text-[#B3181C]' : isNext ? 'text-amber-600' : 'text-neutral-500'}`}>
                {session.heure}
              </span>
            </div>
            <h4 className="text-[12.5px] font-black text-neutral-800 group-hover:text-[#B3181C] transition-colors leading-snug line-clamp-2">
              {session.nom}
            </h4>
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold">
                <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                <span className="truncate">{session.salle}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9.5px] text-neutral-400 font-bold truncate">
                <User className="h-3 w-3 text-neutral-400 shrink-0" />
                <span className="truncate">{session.professeur}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-7">
            <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-neutral-400 bg-neutral-100/80 border border-neutral-200/30 px-2 py-0.5 rounded-md">
              Pas de cours
            </span>
          </div>
        )}
      </div>

      {session && (
        <div className="flex justify-between items-center mt-3.5 pt-2 border-t border-neutral-100">
          <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
            session.type === 'CM' ? 'bg-blue-50 text-blue-600 border border-blue-100/40'
            : session.type === 'TP' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/40'
            : 'bg-amber-50 text-amber-600 border border-amber-100/40'
          }`}>
            {session.type}
          </span>
          {isDirect ? (
            <span className="text-[8.5px] font-black text-[#B3181C] uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
              <Play className="h-2 w-2 fill-current" /> En direct
            </span>
          ) : isNext ? (
            <span className="text-[8.5px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <Compass className="h-3 w-3 text-amber-500 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
              {nextCourse.formattedRemaining}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
