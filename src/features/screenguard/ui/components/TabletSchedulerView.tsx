import React, { useState } from 'react';
import { CalendarSlot, UnassignedCourse, DAYS, SLOTS } from '@/features/admin/domain/PlanningModels';
import { Plus, X, AlertCircle } from 'lucide-react';

interface Props {
  slots: CalendarSlot[];
  unassigned: UnassignedCourse[];
  onSchedule: (courseId: string, day: string, slot: string) => void;
  onRemoveSlot: (id: string) => void;
}

export function TabletSchedulerView({ slots, unassigned, onSchedule, onRemoveSlot }: Props) {
  const [activeCell, setActiveCell] = useState<{ day: string; slot: string } | null>(null);

  const handleSelectCourse = (courseId: string) => {
    if (activeCell) {
      onSchedule(courseId, activeCell.day, activeCell.slot);
      setActiveCell(null);
    }
  };

  return (
    <div id="tablet-scheduler-view" className="space-y-4">
      <div className="bg-red-50 border border-red-200/50 p-3 rounded-xl flex items-center gap-2 text-[10px] text-[#B3181C] font-extrabold uppercase tracking-wide">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#B3181C] animate-pulse" />
        <span>Mode Tablette Actif : Drag & Drop désactivé. Touchez un créneau vide pour l'affecter.</span>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 border-b border-slate-100 pb-2 mb-2 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <div>Heure</div>
            {DAYS.map((d) => <div key={d}>{d}</div>)}
          </div>

          {SLOTS.map((slotTime) => (
            <div key={slotTime} className="grid grid-cols-7 border-b border-slate-100 py-1.5 min-h-[75px] items-stretch">
              <div className="flex items-center justify-center font-black text-slate-500 text-[9px] pr-2 border-r border-slate-100">
                {slotTime}
              </div>

              {DAYS.map((day) => {
                const current = slots.find((s) => s.day === day && s.slot === slotTime);
                return (
                  <div key={day} className="mx-0.5 p-1 flex flex-col justify-center">
                    {current ? (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-2 flex flex-col justify-between h-full relative group">
                        <div>
                          <div className="font-extrabold text-[9px] text-slate-800 leading-tight line-clamp-1">{current.subject}</div>
                          <div className="text-[7px] font-black text-red-600 uppercase mt-0.5">{current.classe}</div>
                        </div>
                        <button
                          onClick={() => onRemoveSlot(current.id)}
                          className="absolute -top-1 -right-1 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white p-0.5 rounded-full transition-all cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveCell({ day, slot: slotTime })}
                        className="w-full h-full min-h-[48px] bg-slate-50 hover:bg-red-50 border border-dashed border-slate-200 hover:border-[#B3181C]/40 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer group"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B3181C] transition-colors" />
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#B3181C]">Affecter</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Popover Selection Overlay */}
      {activeCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Affecter un cours</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{activeCell.day} • {activeCell.slot}</p>
              </div>
              <button onClick={() => setActiveCell(null)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {unassigned.length > 0 ? (
                unassigned.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleSelectCourse(course.id)}
                    className="w-full text-left p-2.5 hover:bg-red-50 border border-slate-100 hover:border-[#B3181C]/20 rounded-xl text-[10px] font-semibold space-y-1 transition-all cursor-pointer block"
                  >
                    <div className="font-extrabold text-slate-800">{course.subject} ({course.classe})</div>
                    <div className="text-[8px] text-slate-400 font-bold">👤 Enseignant : {course.prof} | 📍 {course.room}</div>
                  </button>
                ))
              ) : (
                <p className="text-center text-slate-400 text-[10px] py-4 font-bold">Aucun cours non affecté de disponible.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
