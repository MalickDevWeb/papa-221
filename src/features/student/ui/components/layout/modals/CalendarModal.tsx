import React from 'react';
import { createPortal } from 'react-dom';
import { CalendarWidget } from '@/features/auth/ui/components/CalendarWidget';

interface Props {
  showCalendar: boolean;
  setShowCalendar: (v: boolean) => void;
}

export function CalendarModal({ showCalendar, setShowCalendar }: Props) {
  if (!showCalendar) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[260] flex items-center justify-center p-4 animate-fade-in select-none"
      onClick={() => setShowCalendar(false)}
    >
      <div
        className="bg-white border border-neutral-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full max-w-4xl max-h-[85vh] cursor-default animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-brand-red-deep to-[#8C1014] p-5 text-white flex items-center justify-between shrink-0 select-none relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="flex items-center gap-2.5 relative z-10">
            <span translate="no" className="material-symbols-outlined text-white font-bold text-lg">calendar_today</span>
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wide text-white">Calendrier Académique</h4>
              <p className="text-[9px] text-white/80 font-bold mt-0.5 leading-none">Consultez l'emploi du temps complet</p>
            </div>
          </div>
          <button
            aria-label="Fermer"
            onClick={() => setShowCalendar(false)}
            className="text-white/85 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer relative z-10 hover:scale-105 active:scale-95"
          >
            <span translate="no" className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto no-scrollbar flex-1 bg-white">
          <CalendarWidget variant="transparent" />
        </div>
      </div>
    </div>,
    document.body
  );
}
