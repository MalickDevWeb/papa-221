import React from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, MapPin, User, FileText, CalendarPlus } from 'lucide-react';
import { getGoogleCalendarTemplateUrl } from '@/features/schedule/utils/googleCalendarSync';

export function CourseDetailModal({ state }: { state: any }) {
  const { activePlanCourse: course, setActivePlanCourse, triggerToast } = state;
  if (!course) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setActivePlanCourse(null)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-gray-200/60 flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-5 py-3 text-white relative flex-shrink-0 ${course.type === 'CM' ? 'bg-[#B3181C]' : course.type === 'TP' ? 'bg-[#10B981]' : 'bg-[#B3181C]'}`}>
          <button onClick={() => setActivePlanCourse(null)} className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-widest text-white">{course.type}</span>
            {course.status === 'actuel' && (
              <span className="px-2 py-0.5 rounded-full bg-[#E3A857] text-[#291715] text-[9px] font-black uppercase flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#291715]"></span> En cours
              </span>
            )}
          </div>
          <h4 className="text-base font-black leading-tight tracking-tight pr-8">{course.nom}</h4>
        </div>

        <div className="p-4 space-y-3.5 bg-[#FAF8F6]">
          {course.status === 'annule' && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-2xl text-red-700 text-xs font-bold leading-normal">
              ⚠️ Cet enseignant a signalé son absence pour cette séance. Le cours est annulé.
              {course.cancellationReason && (
                <div className="mt-1.5 text-[11px] font-medium bg-white/80 p-2 rounded-xl border border-red-100/30 text-red-800">
                  <strong>Motif :</strong> {course.cancellationReason}
                </div>
              )}
            </div>
          )}

          <div className="bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-3xs space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-xl bg-orange-50 text-[#B3181C] flex-shrink-0"><Clock className="h-3.5 w-3.5" /></div>
              <div><h5 className="font-black text-[#291715]/40 text-[9px] uppercase tracking-widest">Horaire & Date</h5><p className="text-xs text-neutral-800 font-extrabold mt-0.5">{course.jourComplet} {course.dateStr} • {course.heureStr}</p></div>
            </div>
            <div className="flex items-start gap-2.5 border-t border-neutral-100 pt-3">
              <div className="p-1.5 rounded-xl bg-red-50 text-[#B3181C] flex-shrink-0"><MapPin className="h-3.5 w-3.5" /></div>
              <div><h5 className="font-black text-[#291715]/40 text-[9px] uppercase tracking-widest">Salle de cours</h5><p className="text-xs text-neutral-800 font-extrabold mt-0.5">{course.salle}</p></div>
            </div>
            <div className="flex items-start gap-2.5 border-t border-neutral-100 pt-3">
              <div className="p-1.5 rounded-xl bg-green-50 text-[#10B981] flex-shrink-0"><User className="h-3.5 w-3.5" /></div>
              <div><h5 className="font-black text-[#291715]/40 text-[9px] uppercase tracking-widest">Enseignant</h5><p className="text-xs text-neutral-800 font-extrabold mt-0.5">{course.professeur}</p></div>
            </div>
          </div>

          {course.description && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[#291715]/50"><FileText className="h-3 w-3 text-[#B3181C]" /><h5 className="font-black text-[9px] uppercase tracking-widest">Descriptif du Module & Syllabus</h5></div>
              <p className="text-[11px] text-neutral-600 leading-normal bg-white p-3 rounded-2xl border border-neutral-200/40 shadow-3xs font-medium">{course.description}</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-white border-t border-neutral-150 flex gap-2 flex-shrink-0">
          <button onClick={() => setActivePlanCourse(null)} className="flex-1 py-2 text-center border border-neutral-200 text-neutral-600 hover:text-[#291715] hover:bg-neutral-50 rounded-xl font-bold text-xs transition-all cursor-pointer">Fermer</button>
          <button 
            onClick={() => {
              window.open(getGoogleCalendarTemplateUrl(course), '_blank');
              triggerToast(`Séance de ${course.nom} ouverte dans Google Calendar !`);
              setActivePlanCourse(null);
            }}
            className="flex-1 py-2 bg-[#B3181C] hover:bg-[#8c1215] text-white rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[#B3181C]/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CalendarPlus className="h-3 w-3" /> Synchroniser
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
