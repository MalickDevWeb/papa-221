import React from 'react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { formatTimeRange, formatRoomName } from '../../utils/scheduleFormatter';

interface Props {
  readonly session: ProfessorSchedule;
  readonly isEnCours: boolean;
  readonly isProchain: boolean;
  readonly onEnterCourse?: (courseId: string) => void;
  readonly variant?: 'full' | 'compact';
}

export function ProfessorCompactSessionItem({ session, isEnCours, isProchain, onEnterCourse, variant = 'compact' }: Props) {
  const formattedRoom = formatRoomName(session.room);
  const { display } = formatTimeRange(session.time);

  if (variant === 'full') {
    return (
      <div 
        onClick={() => onEnterCourse?.(session.courseId || session.id)} 
        className="cursor-pointer group flex flex-col flex-grow h-full justify-between"
      >
        <div>
          <span className={`text-[9px] font-black font-mono mb-1.5 inline-block px-2 py-0.5 rounded-md border ${
            isEnCours 
              ? 'bg-white text-[#B3181C] border-[#B3181C]/20' 
              : isProchain
                ? 'bg-white text-amber-600 border-amber-500/20'
                : 'bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10'
          }`}>
            {display}
          </span>
          <h4 className={`text-[12px] font-black leading-tight tracking-tight line-clamp-1 transition-colors duration-200 ${
            isEnCours ? 'text-[#B3181C] group-hover:text-black' : isProchain ? 'text-amber-900 group-hover:text-amber-600' : 'text-neutral-800 group-hover:text-[#B3181C]'
          }`}>
            {session.classe || 'L3-GL'}
          </h4>
          <p className="text-[10px] text-neutral-400 font-semibold leading-tight truncate mt-0.5 group-hover:text-neutral-600 transition-colors">
            {session.courseTitle}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-[9.5px] text-neutral-500 font-bold">
            <span translate="no" className={`material-symbols-outlined text-[10px] ${isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-500' : 'text-[#B3181C]'}`}>location_on</span>
            <span className="truncate">{formattedRoom}</span>
          </div>
          <span translate="no" className={`material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-all ${
            isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-500' : 'text-neutral-300 group-hover:text-[#B3181C]'
          }`}>
            arrow_forward
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onEnterCourse?.(session.courseId || session.id)}
      className={`p-2 rounded-xl border text-left cursor-pointer transition-all duration-300 group/item relative ${
        isEnCours 
          ? 'bg-[#FFF5F5] border-[#B3181C]/40 shadow-sm ring-1 ring-[#B3181C]/5' 
          : isProchain
            ? 'bg-amber-50/60 border-amber-500/30 shadow-sm ring-1 ring-amber-500/5'
            : 'bg-neutral-50/60 border-neutral-200/60 hover:bg-white hover:border-[#B3181C]/20 hover:shadow-xs'
      }`}
    >
      <div className="flex justify-between items-center gap-1.5 mb-1">
        <span className={`text-[8px] font-black font-mono px-1 py-0.5 rounded border ${
          isEnCours 
            ? 'bg-white text-[#B3181C] border-[#B3181C]/15' 
            : isProchain
              ? 'bg-white text-amber-600 border-amber-500/15'
              : 'bg-white text-neutral-500 border-neutral-200'
        }`}>
          {display}
        </span>
        <span className={`text-[7px] font-black px-1 py-0.5 rounded ${
          session.type === 'CM' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-[#137333]'
        }`}>{session.type}</span>
      </div>
      <h5 className={`text-[10.5px] font-black leading-tight truncate ${
        isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-900' : 'text-neutral-800 group-hover/item:text-[#B3181C]'
      }`}>{session.classe || 'L3-GL'}</h5>
      <p className="text-[9.5px] text-neutral-400 font-medium truncate mt-0.5">{session.courseTitle}</p>
      <div className="flex items-center justify-between mt-1 text-[9px] text-neutral-500 font-semibold">
        <span className="flex items-center gap-0.5"><span translate="no" className="material-symbols-outlined text-[9px]">location_on</span>{formattedRoom}</span>
        {isEnCours && (
          <span className="text-[7.5px] font-black text-[#B3181C] animate-pulse flex items-center gap-0.5">
            <span className="w-1 h-1 rounded-full bg-[#B3181C] inline-block animate-ping" />
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}
