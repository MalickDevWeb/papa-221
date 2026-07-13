import React, { useState } from 'react';
import { CalendarSlot, DAYS } from '@/features/admin/domain/PlanningModels';
import { Clock, MapPin, User, LayoutGrid } from 'lucide-react';

interface Props {
  slots: CalendarSlot[];
}

export function MobileSchedulerView({ slots }: Props) {
  const classes = Array.from(new Set(slots.map((s) => s.classe)));
  const [selectedClass, setSelectedClass] = useState(classes[0] || 'L2 Génie Civil');
  const [selectedDay, setSelectedDay] = useState('Lundi');

  const filteredSlots = slots.filter(
    (s) => s.day === selectedDay && s.classe === selectedClass
  );

  return (
    <div id="mobile-scheduler-view" className="space-y-4 p-4 bg-[#FAF8F6] rounded-2xl border border-slate-200">
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">📅 Emploi du Temps du Jour</h3>
        <p className="text-[10px] text-slate-500 font-bold">Vue simplifiée optimisée pour votre smartphone.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[9px] font-black uppercase text-slate-400">Classe</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
          >
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-black uppercase text-slate-400">Jour</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => (
            <div key={slot.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-xs text-slate-900 leading-tight">{slot.subject}</span>
                <span className="bg-red-50 text-[#B3181C] border border-red-200/50 font-black text-[8px] uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {slot.slot}
                </span>
              </div>
              <div className="flex gap-4 text-[10px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#B3181C]" />
                  {slot.prof}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {slot.room}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/80 border border-slate-100 rounded-xl p-8 text-center text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
            Aucun cours planifié pour cette classe ce jour.
          </div>
        )}
      </div>
    </div>
  );
}
