import React from 'react';
import { Calendar, User, MapPin, ArrowRight } from 'lucide-react';
import { CourseSession, CourseDay } from '@/features/schedule/domain/Schedule';

export function TimelineView({ state }: { state: any }) {
  const { schedule, selectedDayMobile, setSelectedDayMobile, triggerToast, fitsFilters, resetAllFilters, setActivePlanCourse, liveSessions, handleJoinLive, enCoursId, prochainId } = state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-3 space-y-3.5 print:hidden">
        <p className="font-black text-[10px] text-[#291715]/40 uppercase tracking-widest pl-1">Calendrier Hebdomadaire</p>
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-3 lg:pb-0 select-none no-scrollbar snap-x scroll-smooth">
          {(['LUN', 'MAR', 'MER', 'JEU', 'VEN'] as const).map((day) => {
            const dayLabel = { LUN: 'Lundi', MAR: 'Mardi', MER: 'Mercredi', JEU: 'Jeudi', VEN: 'Vendredi' }[day];
            const dayDate = { LUN: '23 Oct', MAR: '24 Oct', MER: '25 Oct', JEU: '26 Oct', VEN: '27 Oct' }[day];
            const resultsCount = schedule.filter((c: CourseSession) => c.jour === day).filter(fitsFilters).length;
            const isSelected = selectedDayMobile === day;

            return (
              <button key={day} onClick={() => { setSelectedDayMobile(day); triggerToast(`Affichage : ${dayLabel}`); }} className={`flex-grow lg:flex-grow-0 py-4 px-5 rounded-2xl font-black text-xs transition-all flex flex-row lg:flex-col items-center lg:items-start justify-between relative cursor-pointer min-w-[130px] shrink-0 snap-start border ${isSelected ? 'bg-[#B3181C] text-white border-[#B3181C] shadow-md shadow-[#B3181C]/15 scale-102' : 'bg-white text-neutral-650 hover:bg-neutral-50 border-neutral-200'}`}>
                <div className="text-left"><span className="block text-xs uppercase tracking-tight">{dayLabel}</span><span className={`block text-[10px] ${isSelected ? 'text-white/80' : 'text-neutral-400'} font-bold mt-1`}>{dayDate}</span></div>
                {resultsCount > 0 && <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isSelected ? 'bg-white text-[#B3181C]' : 'bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10'}`}>{resultsCount}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-9 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-xs uppercase tracking-widest text-[#291715]/70">Plan du {selectedDayMobile === 'LUN' ? 'Lundi' : selectedDayMobile === 'MAR' ? 'Mardi' : selectedDayMobile === 'MER' ? 'Mercredi' : selectedDayMobile === 'JEU' ? 'Jeudi' : 'Vendredi'}</h3>
          <span className="px-3.5 py-1 text-[9px] font-black uppercase rounded-full bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10 select-none">{schedule.filter((c: CourseSession) => c.jour === selectedDayMobile).filter(fitsFilters).length} séances configurées</span>
        </div>

        {schedule.filter((c: CourseSession) => c.jour === selectedDayMobile).filter(fitsFilters).length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-gray-200/80 rounded-3xl space-y-3.5 shadow-3xs">
            <div className="h-14 w-14 rounded-full bg-[#FAF8F6] flex items-center justify-center mx-auto text-neutral-300"><Calendar className="h-6 w-6" /></div>
            <div><p className="font-extrabold text-sm text-neutral-700">Aucune séance dans cet agenda</p><p className="text-[10.5px] text-neutral-400 max-w-sm mx-auto leading-relaxed mt-1">Aucun cours ne correspond aux filtres appliqués. Réinitialisez pour voir tout.</p></div>
            <button onClick={resetAllFilters} className="px-4 py-2 bg-[#FAF8F6] border border-neutral-200 text-[#B3181C] rounded-xl text-[10px] font-black tracking-wider uppercase hover:bg-[#FFF5F5] transition-all cursor-pointer inline-flex items-center gap-1">Tout Réinitialiser</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schedule.filter((c: CourseSession) => c.jour === selectedDayMobile).filter(fitsFilters).map((cours: CourseSession) => {
              const activeSession = Array.isArray(liveSessions) && cours ? liveSessions.find((s: any) => s && s.status === 'active' && s.courseName && cours.nom && s.courseName.toLowerCase() === cours.nom.toLowerCase()) : null;
              const isCancelled = cours.status === 'annule';
              const isEnCours = !isCancelled && (cours.id === enCoursId || cours.status === 'actuel');
              const isProchain = !isCancelled && cours.id === prochainId;

              return (
                <div key={cours.id} onClick={() => setActivePlanCourse(cours)} className={`p-5 bg-white rounded-2xl transition-all duration-305 cursor-pointer hover:shadow-md flex gap-4.5 relative border ${
                  isCancelled ? 'border-red-200 bg-red-50/15' :
                  isEnCours ? 'border-[#B3181C] bg-[#FFF5F5]/40 shadow-xs ring-4 ring-[#B3181C]/5' :
                  isProchain ? 'border-amber-500 bg-amber-50/20 shadow-xs ring-4 ring-amber-500/5' :
                  cours.type === 'CM' ? 'border-[#B3181C]/15 shadow-3xs' : cours.type === 'TP' ? 'border-[#10B981]/20 shadow-3xs' : 'border-blue-200/50 shadow-3xs'
                }`}>
                  {isCancelled && (
                    <span className="absolute top-2.5 right-2.5 bg-red-100 text-red-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                      Absence / Annulé
                    </span>
                  )}
                  {(isEnCours || isProchain || activeSession) && !isCancelled && (
                    <span className="absolute -top-1.5 left-5 flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProchain ? 'bg-amber-500' : 'bg-[#B3181C]'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isProchain ? 'bg-amber-500' : 'bg-[#B3181C]'}`}></span>
                    </span>
                  )}
                  <div className="flex flex-col justify-between items-center text-center py-0.5 shrink-0 w-20 border-r border-neutral-100 pr-4">
                    <div className="space-y-0.5">
                      <span className={`text-xs font-black block ${isCancelled ? 'text-neutral-450 line-through' : isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-600' : 'text-[#291715]'}`}>{cours.heureDebut}</span>
                      <span className="text-[10px] font-bold text-neutral-400 block">{cours.heureFin}</span>
                    </div>
                    <span className={`mt-3 px-2 py-1 rounded-lg text-[9px] font-black tracking-wide uppercase ${
                      isCancelled ? 'bg-neutral-100 text-neutral-400' :
                      isEnCours ? 'bg-[#B3181C] text-white' :
                      isProchain ? 'bg-amber-500 text-white' :
                      cours.type === 'CM' ? 'bg-[#FFF5F5] text-[#B3181C]' : cours.type === 'TP' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-blue-50 text-blue-600'
                    }`}>{isCancelled ? 'Annulé' : isEnCours ? 'En cours' : isProchain ? 'Suivant' : cours.type}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className={`font-extrabold text-xs leading-snug mb-1 ${isCancelled ? 'text-neutral-400 line-through' : isEnCours ? 'text-[#B3181C]' : isProchain ? 'text-amber-900' : 'text-[#291715]'}`}>{cours.nom}</h4>
                      <p className="text-[10.5px] text-neutral-500 font-bold flex items-center gap-1"><User className="h-3 w-3 text-neutral-400 shrink-0" />{cours.professeur}</p>
                      {isCancelled && cours.cancellationReason && (
                        <p className="text-[9.5px] text-red-600 font-extrabold mt-1">⚠️ Absent : {cours.cancellationReason}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-xl border flex items-center gap-1 font-bold ${
                        isCancelled ? 'bg-neutral-50 text-neutral-400 border-neutral-100' :
                        isEnCours ? 'bg-[#B3181C]/10 text-[#B3181C] border-[#B3181C]/10' :
                        isProchain ? 'bg-amber-500/10 text-amber-600 border-amber-500/10' :
                        'bg-[#FFF5F5] text-[#B3181C] border-[#B3181C]/5'
                      }`}><MapPin className="h-3 w-3" />{cours.salle}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {activeSession && !isCancelled && (
                          <button onClick={(e) => { e.stopPropagation(); handleJoinLive(activeSession); }} className="bg-[#B3181C] hover:bg-[#8c1215] text-white px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase flex items-center gap-1 border-0 shadow-sm animate-pulse">Rejoindre</button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setActivePlanCourse(cours); }} className="bg-[#B3181C]/5 hover:bg-[#B3181C] hover:text-white text-[#B3181C] px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase flex items-center gap-1 border border-[#B3181C]/10">{isCancelled ? 'Détails' : 'Syllabus'}<ArrowRight className="h-2.5 w-2.5" /></button>
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
