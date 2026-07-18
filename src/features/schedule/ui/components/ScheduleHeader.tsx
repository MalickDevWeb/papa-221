import React from 'react';
import { Download, CalendarPlus, Sparkles } from 'lucide-react';
import { exportToPDF } from '@/features/schedule/utils/pdfExport';

export function ScheduleHeader({ state }: { state: any }) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-5">
      <div>
        <div className="flex items-center gap-2 mb-1 print:hidden">
          <span className="bg-[#B3181C]/5 text-[#B3181C] border border-[#B3181C]/15 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 animate-pulse" /> Portail Étudiant
          </span>
          <span className="text-neutral-300 text-xs select-none">•</span>
          <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Université École 221</span>
        </div>
        <h1 className="font-headline-lg text-[26px] md:text-[34px] text-[#291715] font-black tracking-tight leading-none mb-2">
          Emploi du Temps
        </h1>
        <p className="text-neutral-gray-500 font-bold text-xs md:text-sm">
          Semaine du 23 au 27 Octobre 2023 • Semestre 1 • Classe L3-GL
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2.5 w-full xl:w-auto print:hidden">
        <button 
          onClick={async () => {
            state.triggerToast("Génération de votre PDF personnalisé avec logo...");
            await exportToPDF(state.schedule, 'L3-GL');
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-neutral-200 bg-white px-4 h-11 rounded-2xl hover:bg-neutral-50 transition-all font-black text-xs text-neutral-700 cursor-pointer shadow-3xs whitespace-nowrap"
        >
          <Download className="h-4 w-4 text-neutral-500" /> PDF Personnalisé
        </button>
        
        <button 
          onClick={() => state.setIsSyncModalOpen(true)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#B3181C] text-white px-4 h-11 rounded-2xl hover:bg-[#8c1215] transition-all font-black text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-[#B3181C]/10 whitespace-nowrap"
        >
          <CalendarPlus className="h-4 w-4" /> Synchroniser Agenda
        </button>
      </div>
    </div>
  );
}
