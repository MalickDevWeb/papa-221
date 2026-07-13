import React from 'react';
import { CalendarWidget } from './CalendarWidget';

interface MobileCalendarModalProps {
  setShowMobileCalendarModal: (show: boolean) => void;
}

export function MobileCalendarModal({ setShowMobileCalendarModal }: MobileCalendarModalProps) {
  return (
    <div className="fixed inset-0 bg-[#291715]/65 backdrop-blur-md z-[300] flex items-center justify-center p-2 animate-fade-in">
      <div className="fixed inset-0 cursor-pointer" onClick={() => setShowMobileCalendarModal(false)} />
      <div className="bg-[#FAF8F6] rounded-[32px] shadow-[0_24px_64px_rgba(41,23,21,0.25)] border border-[#E2DCDA] w-full max-w-[500px] max-h-[92vh] overflow-y-auto relative z-10 p-5 animate-scale-up flex flex-col no-scrollbar" style={{ margin: '6px 13px' }}>
        <div className="flex justify-between items-center mb-4 pb-3.5 border-b border-[#E2DCDA]/80 shrink-0 select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-[#B3181C] text-white rounded-xl shadow-md shadow-[#B3181C]/15 flex items-center justify-center"><span translate="no" className="material-symbols-outlined text-[20px] font-bold">calendar_month</span></div>
            <div><h3 className="font-heading font-black text-xs uppercase text-[#291715] tracking-widest">Calendrier Académique</h3><p className="text-[9px] text-[#8E7977] font-black uppercase leading-none mt-1">ÉCOLE 221 · ESPACE INTERACTIF</p></div>
          </div>
          <button onClick={() => setShowMobileCalendarModal(false)} className="px-3.5 py-1.5 rounded-xl bg-[#B3181C]/10 text-[#B3181C] hover:bg-[#B3181C]/20 text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-[#B3181C]/5">Fermer</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto no-scrollbar pr-0.5">
          <CalendarWidget variant="transparent" />
        </div>
      </div>
    </div>
  );
}
