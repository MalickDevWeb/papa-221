import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, User, Sparkles } from 'lucide-react';

export function MonthlyView({ state, juneDays }: { state: any, juneDays: any[] }) {
  const selectedDayInfo = juneDays[state.selectedMonthDayIdx];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full items-stretch">
      {/* Calendar Grid Container */}
      <div className="md:col-span-7 bg-white p-4 rounded-2xl border border-neutral-100 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <span className="text-xs md:text-sm font-black text-neutral-800 tracking-tight flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B3181C]" />
            Juin 2026
          </span>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-colors cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-black text-[9px] text-[#8E7977] uppercase tracking-wider mb-2.5">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 flex-grow">
          {juneDays.map((dayItem, dayIdx) => (
            <button
              key={dayIdx}
              onClick={() => state.setSelectedMonthDayIdx(dayIdx)}
              className={`h-9 w-full rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 text-xs ${
                state.selectedMonthDayIdx === dayIdx
                  ? 'bg-[#B3181C] text-white font-black shadow-md shadow-[#B3181C]/20 scale-105 z-10'
                  : dayItem.dayOfWeekIndex >= 5
                  ? 'bg-neutral-50/50 text-neutral-300 hover:bg-neutral-100/50'
                  : 'bg-white hover:bg-[#FFF5F5] border border-neutral-100 text-neutral-700 font-bold hover:border-[#B3181C]/20'
              }`}
            >
              <span>{dayItem.dayNumber}</span>
              {dayItem.hasClass && (
                <span
                  className="h-1.5 w-1.5 rounded-full absolute bottom-1 transition-colors duration-200"
                  style={{
                    backgroundColor: state.selectedMonthDayIdx === dayIdx ? '#FFFFFF' : dayItem.mainColor,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="md:col-span-5 bg-gradient-to-b from-neutral-50/60 to-neutral-100/20 rounded-2xl border border-neutral-200/80 p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="pb-3 border-b border-neutral-200/60 mb-4 flex items-center justify-between">
            <h4 className="font-black text-xs uppercase tracking-wider text-neutral-700">
              Journée du {selectedDayInfo.dayNumber} Juin
            </h4>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-500">
              {selectedDayInfo.dayName}
            </span>
          </div>

          {selectedDayInfo.classItem ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-neutral-150 shadow-sm">
                <h5 className="font-black text-xs text-neutral-800 leading-snug">
                  {selectedDayInfo.classItem.nom}
                </h5>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-neutral-400 font-bold">
                  <span className="px-1.5 py-0.5 rounded bg-neutral-50 text-neutral-500 uppercase tracking-wide border text-[9px]">
                    {selectedDayInfo.classItem.type}
                  </span>
                  <span>•</span>
                  <span>{selectedDayInfo.classItem.heure}</span>
                </div>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-neutral-150/60">
                <p className="text-[10.5px] text-neutral-500 font-medium leading-relaxed">
                  {selectedDayInfo.classItem.syllabus || "Aucun syllabus renseigné pour cette session."}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400/80 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-neutral-300" />
              <p className="text-[10.5px] font-black uppercase tracking-wider text-neutral-400">
                Aucun cours planifié
              </p>
            </div>
          )}
        </div>

        {selectedDayInfo.classItem && (
          <button
            onClick={() => state.handleSelectCourse(selectedDayInfo.classItem)}
            className="w-full py-3 bg-white text-[#B3181C] hover:bg-[#B3181C] hover:text-white border border-[#B3181C]/25 hover:border-transparent rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1.5 mt-5 shadow-sm transition-all duration-300 cursor-pointer active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Interagir & Prendre Notes
          </button>
        )}
      </div>
    </div>
  );
}

