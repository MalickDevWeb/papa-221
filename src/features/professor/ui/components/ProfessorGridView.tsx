import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { HOURS, DAYS, DAY_LABELS, DAY_DATES, SHORT_TO_FULL } from './ProfessorGridViewConstants';
import { ProfessorGridCell } from './ProfessorGridCell';

interface Props {
  readonly schedule: readonly ProfessorSchedule[];
  readonly fitsFilters: (s: ProfessorSchedule) => boolean;
  readonly onSelectSession: (s: ProfessorSchedule) => void;
  readonly liveSessions?: readonly any[];
}

export function ProfessorGridView({ schedule, fitsFilters, onSelectSession, liveSessions = [] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'L' | 'R') => ref.current?.scrollBy({ left: dir === 'L' ? -280 : 280, behavior: 'smooth' });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-[#FFF5F5]/40 p-4 border border-neutral-200/50 rounded-2xl print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B3181C] animate-pulse" />
          <p className="text-[10px] font-extrabold text-[#291715] uppercase tracking-wider">Support Tactile & Tablette</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scroll('L')} className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 flex items-center justify-center border-0 cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll('R')} className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 flex items-center justify-center border-0 cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div ref={ref} className="overflow-x-auto rounded-3xl border border-neutral-gray-200/95 bg-white shadow-3xs select-none smooth-scroll leading-none">
        <table className="w-full border-collapse table-fixed min-w-[980px]">
          <thead>
            <tr className="bg-[#FFF5F5]/40 border-b border-neutral-200">
              <th className="w-[100px] h-14 text-center text-[10px] font-black text-neutral-500 tracking-widest uppercase border-r border-neutral-150">Horaire</th>
              {DAYS.map((day) => (
                <th key={day} className="h-14 text-center border-r border-neutral-150 p-2">
                  <span className="block text-xs font-black text-[#291715] tracking-widest">{DAY_LABELS[day]}</span>
                  <span className="block text-[10px] text-[#B3181C] font-semibold tracking-wider mt-1">{DAY_DATES[day]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150">
            {HOURS.map((time) => {
              if (time === '12:00') {
                return (
                  <tr key={time} className="bg-[#FAF8F6] border-y border-neutral-200/60">
                    <td className="h-12 text-center font-black text-[10.5px] text-neutral-500 border-r border-neutral-150 flex items-center justify-center gap-1.5 bg-[#FFF5F5]/20"><Coffee className="h-3.5 w-3.5 text-[#B3181C]" /><span>12:00</span></td>
                    <td colSpan={5} className="h-12 text-center bg-gradient-to-r from-transparent via-[#FFF5F5]/40 to-transparent">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-[#B3181C] uppercase py-1">
                        <Coffee className="h-4 w-4 animate-bounce shrink-0" /><span>Pause Déjeuner · Repos académique</span><Coffee className="h-4 w-4 animate-bounce shrink-0" />
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={time} className="hover:bg-neutral-50/50">
                  <td className="h-28 text-center text-xs font-bold text-neutral-500 border-r border-neutral-150 align-top pt-3.5">{time}</td>
                  {DAYS.map((day) => {
                    const matched = schedule.find((s) => s.day === SHORT_TO_FULL[day] && s.time.startsWith(time));
                    const isPriorOccupied = schedule.some((s) => {
                      if (s.day !== SHORT_TO_FULL[day]) return false;
                      const [start, end] = s.time.split(' - ').map(t => parseInt(t.split(':')[0]));
                      const currentH = parseInt(time.split(':')[0]);
                      return currentH > start && currentH < end;
                    });

                    if (isPriorOccupied) return null;

                    let rowSpan = 1;
                    if (matched) {
                      const [startH, endH] = matched.time.split(' - ').map(t => parseInt(t.split(':')[0]));
                      rowSpan = Math.max(1, endH - startH);
                      if (startH < 12 && endH > 12) rowSpan -= 1;
                    }

                    const match = matched ? fitsFilters(matched) : false;

                    return (
                      <td key={day} rowSpan={rowSpan} className="p-2 border-r border-neutral-gray-150 align-top">
                        <ProfessorGridCell matched={matched} match={match} rowSpan={rowSpan} onSelectSession={onSelectSession} liveSessions={liveSessions} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
