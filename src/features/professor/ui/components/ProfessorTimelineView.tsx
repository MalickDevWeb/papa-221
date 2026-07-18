import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { formatTimeRange, formatRoomName } from '../../utils/scheduleFormatter';

interface Props {
  readonly schedule: readonly ProfessorSchedule[];
  readonly selectedDay: string;
  readonly setSelectedDay: (day: string) => void;
  readonly fitsFilters: (s: ProfessorSchedule) => boolean;
  readonly resetAllFilters: () => void;
  readonly onSelectSession: (s: ProfessorSchedule) => void;
  readonly liveSessions?: readonly any[];
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;
const DAY_DATES = { Lundi: '23 Oct', Mardi: '24 Oct', Mercredi: '25 Oct', Jeudi: '26 Oct', Vendredi: '27 Oct' };

export function ProfessorTimelineView({
  schedule, selectedDay, setSelectedDay, fitsFilters, resetAllFilters, onSelectSession, liveSessions = []
}: Props) {
  const filteredSessions = schedule.filter((s) => s.day === selectedDay && fitsFilters(s));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-3 space-y-3.5 print:hidden">
        <p className="font-black text-[10px] text-[#291715]/40 uppercase tracking-widest pl-1">Calendrier Hebdomadaire</p>
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-3 lg:pb-0 select-none no-scrollbar snap-x scroll-smooth">
          {DAYS.map((day) => {
            const count = schedule.filter((s) => s.day === day && fitsFilters(s)).length;
            const active = selectedDay === day;

            return (
              <button key={day} onClick={() => setSelectedDay(day)} className={`flex-grow lg:flex-grow-0 py-4 px-5 rounded-2xl font-black text-xs transition-all flex flex-row lg:flex-col items-center lg:items-start justify-between relative cursor-pointer min-w-[130px] shrink-0 snap-start border ${active ? 'bg-[#B3181C] text-white border-[#B3181C] shadow-md scale-102' : 'bg-white text-neutral-650 hover:bg-neutral-50 border-neutral-200'}`}>
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-tight">{day}</span>
                  <span className={`block text-[10px] ${active ? 'text-white/80' : 'text-neutral-400'} font-bold mt-1`}>{DAY_DATES[day]}</span>
                </div>
                {count > 0 && <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${active ? 'bg-white text-[#B3181C]' : 'bg-[#FFF5F5] text-[#B3181C]'}`}>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-9 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-xs uppercase tracking-widest text-[#291715]/70">Plan du {selectedDay}</h3>
          <span className="px-3.5 py-1 text-[9px] font-black uppercase rounded-full bg-[#FFF5F5] text-[#B3181C] select-none">
            {filteredSessions.length} séances configurées
          </span>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-gray-200/80 rounded-3xl space-y-3.5 shadow-3xs">
            <div className="h-14 w-14 rounded-full bg-[#FAF8F6] flex items-center justify-center mx-auto text-neutral-300"><Calendar className="h-6 w-6" /></div>
            <div>
              <p className="font-extrabold text-sm text-neutral-700">Aucune séance dans cet agenda</p>
              <p className="text-[10.5px] text-neutral-400 max-w-sm mx-auto leading-relaxed mt-1">Aucun cours ne correspond aux filtres appliqués. Réinitialisez pour voir tout.</p>
            </div>
            <button onClick={resetAllFilters} className="px-4 py-2 bg-[#FAF8F6] border border-neutral-200 text-[#B3181C] rounded-xl text-[10px] font-black tracking-wider uppercase hover:bg-[#FFF5F5] transition-all cursor-pointer inline-flex items-center gap-1">Tout Réinitialiser</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {filteredSessions.map((session) => {
               const { start, end } = formatTimeRange(session.time);
               const formattedRoom = formatRoomName(session.room);
               const activeSession = Array.isArray(liveSessions) && session ? liveSessions.find((s: any) => s && s.status === 'active' && s.courseName && session.courseTitle && s.courseName.toLowerCase() === session.courseTitle.toLowerCase()) : null;
               return (
                 <div key={session.id} onClick={() => onSelectSession(session)} className={`p-5 bg-white rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-md flex gap-4.5 relative border ${session.status === 'annule' ? 'border-neutral-200 bg-neutral-50/50' : activeSession ? 'border-[#B3181C] bg-[#FFF5F5]/30 shadow-xs ring-4 ring-[#B3181C]/5' : 'border-neutral-gray-150 shadow-3xs'}`}>
                   <div className="flex flex-col justify-between items-center text-center py-0.5 shrink-0 w-20 border-r border-[#FAF8F6] pr-4">
                     <div className="space-y-0.5">
                       <span className="text-xs font-black text-[#291715] block">{start}</span>
                       <span className="text-[10px] font-bold text-neutral-400 block">à {end}</span>
                     </div>
                     <span className="mt-3 px-2 py-1 rounded-lg text-[9px] font-black tracking-wide uppercase bg-[#FFF5F5] text-[#B3181C]">{session.type}</span>
                   </div>
                   <div className="flex-1 flex flex-col justify-between">
                     <div>
                       <h4 className="font-extrabold text-xs leading-snug text-[#291715]">{session.classe || 'L3-GL'}</h4>
                       <p className="text-[10px] text-neutral-500 font-bold mb-1.5">{session.courseTitle}</p>
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${session.status === 'annule' ? 'bg-red-100 text-[#B3181C]' : activeSession ? 'bg-[#B3181C] text-white animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>{session.status === 'annule' ? 'Annulé' : activeSession ? 'En Direct' : 'Confirmé'}</span>
                     </div>
                     <div className="flex items-center justify-between gap-2 mt-4">
                       <span className="text-[10px] text-[#B3181C] bg-[#FFF5F5] px-2.5 py-1 rounded-xl border border-[#B3181C]/5 flex items-center gap-1 font-bold"><MapPin className="h-3 w-3 shrink-0" />{formattedRoom}</span>
                       <div className="flex items-center gap-1.5 shrink-0">
                         {activeSession && (
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               if (activeSession.hlsUrl) {
                                 window.open(activeSession.hlsUrl, '_blank', 'noopener,noreferrer');
                               }
                             }}
                             className="bg-[#B3181C] hover:bg-[#8c1215] text-white px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer border-0 shadow-sm animate-pulse"
                           >
                             <span className="w-1 h-1 rounded-full bg-white animate-ping shrink-0" />
                             Rejoindre
                           </button>
                         )}
                         <button onClick={(e) => { e.stopPropagation(); onSelectSession(session); }} className="bg-[#B3181C]/5 hover:bg-[#B3181C] hover:text-white text-[#B3181C] px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer border border-[#B3181C]/10">Gérer <ArrowRight className="h-2.5 w-2.5 font-bold" /></button>
                       </div>
                     </div>
                   </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
}
