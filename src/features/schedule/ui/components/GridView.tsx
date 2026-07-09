import React from 'react';
import { ChevronLeft, ChevronRight, Coffee, MapPin } from 'lucide-react';
import { CourseSession } from '@/features/schedule/domain/Schedule';
import { LiveIndicator } from '@/shared/components';

export function GridView({ state }: { state: any }) {
  const { schedule, gridContainerRef, scrollGrid, fitsFilters, setActivePlanCourse, liveSessions, handleJoinLive, enCoursId, prochainId } = state;
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'] as const;
  const dayLabels = { LUN: 'LUNDI', MAR: 'MARDI', MER: 'MERCREDI', JEU: 'JEUDI', VEN: 'VENDREDI' };
  const dayDates = { LUN: '23 Oct', MAR: '24 Oct', MER: '25 Oct', JEU: '26 Oct', VEN: '27 Oct' };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-[#FFF5F5]/40 p-4 border border-neutral-200/50 rounded-2xl print:hidden">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#B3181C] animate-pulse" /><p className="text-[10px] font-extrabold text-[#291715] uppercase tracking-wider">Support Défilement Tactile & Tablette</p></div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scrollGrid('left')} className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 flex items-center justify-center active:scale-95 transition-all cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scrollGrid('right')} className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 flex items-center justify-center active:scale-95 transition-all cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div ref={gridContainerRef} className="overflow-x-auto rounded-3xl border border-neutral-gray-200/95 bg-white shadow-3xs select-none smooth-scroll leading-none">
        <table className="w-full border-collapse table-fixed min-w-[980px]">
          <thead>
            <tr className="bg-[#FFF5F5]/40 border-b border-neutral-200">
              <th className="w-[100px] h-14 text-center text-[10px] font-black text-neutral-500 tracking-widest uppercase border-r border-neutral-150">Horaire</th>
              {days.map((day) => (
                <th key={day} className="h-14 text-center border-r border-neutral-150 p-2"><span className="block text-xs font-black text-[#291715] tracking-widest">{dayLabels[day]}</span><span className="block text-[10px] text-[#B3181C] font-semibold tracking-wider mt-1">{dayDates[day]}</span></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150">
            {hours.map((time) => {
              if (time === '12:00') {
                return (
                  <tr key={time} className="bg-[#FAF8F6] border-y border-[#B3181C]/10">
                    <td className="h-12 text-center font-black text-[10.5px] text-neutral-500 border-r border-neutral-150 flex items-center justify-center gap-1.5 bg-[#FFF5F5]/20"><Coffee className="h-3.5 w-3.5 text-[#B3181C]" /><span>12:00</span></td>
                    <td colSpan={5} className="h-12 text-center"><div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-[#B3181C] uppercase"><Coffee className="h-4 w-4 animate-bounce" /><span>Pause Déjeuner · Repos académique</span></div></td>
                  </tr>
                );
              }
              return (
                <tr key={time} className="hover:bg-neutral-50/50">
                  <td className="h-28 text-center text-xs font-bold text-neutral-500 border-r border-neutral-150 align-top pt-3.5">{time}</td>
                  {days.map((day) => {
                    const matchedCourse = schedule.find((c: CourseSession) => c.jour === day && parseInt(c.heureDebut.split(':')[0]) === parseInt(time.split(':')[0]));
                    const isOccupiedByPrior = schedule.some((c: CourseSession) => {
                      const targetH = parseInt(time.split(':')[0]);
                      return c.jour === day && targetH > parseInt(c.heureDebut.split(':')[0]) && targetH < parseInt(c.heureFin.split(':')[0]);
                    });
                    if (isOccupiedByPrior) return null;
                    let rowSpan = 1;
                    if (matchedCourse) {
                      const startH = parseInt(matchedCourse.heureDebut.split(':')[0]), endH = parseInt(matchedCourse.heureFin.split(':')[0]);
                      rowSpan = Math.max(1, endH - startH);
                      if (startH < 12 && endH > 12) rowSpan -= 1;
                    }
                    const match = matchedCourse ? fitsFilters(matchedCourse) : false;
                    const activeSession = Array.isArray(liveSessions) && matchedCourse ? liveSessions.find((s: any) => s && s.status === 'active' && s.courseName && matchedCourse.nom && s.courseName.toLowerCase() === matchedCourse.nom.toLowerCase()) : null;
                    const isEnCours = matchedCourse && (matchedCourse.id === enCoursId || matchedCourse.status === 'actuel');
                    const isProchain = matchedCourse && matchedCourse.id === prochainId;

                    return (
                      <td key={day} rowSpan={rowSpan} className={`p-2 border-r border-neutral-gray-150 align-top ${matchedCourse ? 'h-auto' : 'h-28'}`}>
                        {matchedCourse && (
                          <div onClick={() => match && setActivePlanCourse(matchedCourse)} style={{ height: `${rowSpan * 105}px` }} className={`p-3.5 rounded-2xl transition-all duration-305 flex flex-col justify-between group overflow-hidden border ${
                            !match ? 'opacity-10 grayscale scale-[0.98] pointer-events-none' :
                            isEnCours ? 'bg-[#B3181C] text-white border-transparent shadow-md ring-4 ring-[#B3181C]/5 scale-101' :
                            isProchain ? 'bg-amber-500 text-white border-transparent shadow-md ring-4 ring-amber-500/10 scale-101 animate-pulse' :
                            matchedCourse.type === 'CM' ? 'bg-[#FFF5F5] border-[#B3181C]/15 hover:bg-[#ffebeb] text-[#291715]' :
                            matchedCourse.type === 'TP' ? 'bg-[#E1F7EC] border-[#10B981]/20 hover:bg-[#d0f2df] text-neutral-850' : 'bg-blue-50/70 border-blue-200/50 hover:bg-blue-100 text-neutral-800'
                          } cursor-pointer`}>
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className={`text-[9px] font-black tracking-wider uppercase ${(isEnCours || isProchain) ? 'text-white/80' : 'text-neutral-400'}`}>{matchedCourse.heureStr}</span>
                                <div className="flex items-center gap-1">
                                  {isEnCours || isProchain ? (
                                    <LiveIndicator status={isEnCours ? 'en-cours' : 'prochain'} size="sm" />
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest bg-white text-[#B3181C] border border-[#B3181C]/10">{matchedCourse.type}</span>
                                  )}
                                </div>
                              </div>
                              <h4 className={`font-black text-xs leading-snug tracking-tight transition-colors break-words text-ellipsis line-clamp-2 ${(isEnCours || isProchain) ? 'text-white' : 'text-[#291715] group-hover:text-[#B3181C]'}`}>{matchedCourse.nom}</h4>
                              <p className={`text-[10px] leading-tight font-semibold mt-1 truncate ${(isEnCours || isProchain) ? 'text-white/80' : 'text-neutral-400'}`}>{matchedCourse.professeur}</p>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-neutral-200/10 flex items-center justify-between gap-1 select-none">
                              <span className={`text-[9px] flex items-center gap-1 font-black ${(isEnCours || isProchain) ? 'text-white/90' : 'text-[#B3181C]'}`}><MapPin className="h-3 w-3" />{matchedCourse.salle}</span>
                              {activeSession ? (
                                <button onClick={(e) => { e.stopPropagation(); handleJoinLive(activeSession); }} className="py-1 px-2.5 rounded-lg bg-[#B3181C] hover:bg-[#8c1215] text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border-0 shadow-sm shrink-0">Rejoindre</button>
                              ) : (
                                <span className={`text-[8.5px] font-black uppercase tracking-widest group-hover:inline-block hidden ${(isEnCours || isProchain) ? 'text-white/95' : 'text-[#B3181C]'}`}>Agenda &rarr;</span>
                              )}
                            </div>
                          </div>
                        )}
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
