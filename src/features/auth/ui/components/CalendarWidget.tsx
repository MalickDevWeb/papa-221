import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle } from 'lucide-react';
import { useCalendarState } from './calendar/useCalendarState';
import { CalendarHeader } from './calendar/CalendarHeader';
import { WeeklyView } from './calendar/WeeklyView';
import { MonthlyView } from './calendar/MonthlyView';
import { CourseModal } from './calendar/CourseModal';
import { QRModal } from './calendar/QRModal';

export function CalendarWidget({ variant = 'default' }: { variant?: 'default' | 'transparent' } = {}) {
  const state = useCalendarState();

  const juneDays = Array.from({ length: 30 }, (_, idx) => {
    const dayNumber = idx + 1;
    const dayOfWeekIndex = idx % 7;
    const daysNameMap = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const dayName = daysNameMap[dayOfWeekIndex];
    let classItem, hasClass = false, mainColor = '';

    if (dayOfWeekIndex < 5) {
      const dayKeys: ('LUN'|'MAR'|'MER'|'JEU'|'VEN')[] = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'];
      classItem = state.rawSessions.find(s => s.jour === dayKeys[dayOfWeekIndex]);
      if (classItem) {
        hasClass = true;
        mainColor = classItem.type === 'CM' ? '#3B82F6' : (classItem.type === 'TP' ? '#10B981' : '#F59E0B');
      }
    }
    return { dayNumber, dayName, dayOfWeekIndex, hasClass, mainColor, classItem };
  });

  return (
    <div className={`w-full flex flex-col justify-start overflow-hidden text-neutral-800 ${variant === 'transparent' ? 'bg-transparent p-0 border-0 shadow-none' : 'bg-white p-4 md:p-6 rounded-3xl border border-neutral-150 shadow-sm'}`}>
      {state.toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-900 border text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 z-[120] animate-bounce">
          <CheckCircle className="h-4 w-4 text-emerald-400" /><span>{state.toastMessage}</span>
        </div>
      )}
      <CalendarHeader state={state} />
      <div className="flex-grow overflow-y-auto no-scrollbar min-h-[300px] flex flex-col justify-start mt-1">
        {state.viewType === 'weekly' && <WeeklyView state={state} />}
        {state.viewType === 'monthly' && <MonthlyView state={state} juneDays={juneDays} />}
      </div>
      <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-2 text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Sélectionnez un cours pour y accéder directment
        </span>
        <span className="text-neutral-300 font-bold">Version 2.3 · École 221</span>
      </div>
      {state.selectedCourse && createPortal(<CourseModal state={state} />, document.body)}
      {state.showQRModal && createPortal(<QRModal state={state} />, document.body)}
    </div>
  );
}
