import React from 'react';
import { Check, GraduationCap, FileText, Laptop, Info } from 'lucide-react';
import { useSchedulePageState } from '../components/useSchedulePageState';
import { ScheduleHeader } from '../components/ScheduleHeader';
import { ScheduleFilters } from '../components/ScheduleFilters';
import { TimelineView } from '../components/TimelineView';
import { GridView } from '../components/GridView';
import { ScheduleMetrics } from '../components/ScheduleMetrics';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { SyncModal } from '../components/SyncModal';

export function StudentSchedulePage() {
  const state = useSchedulePageState();

  return (
    <div className="flex-1 px-4 md:px-8 py-6 md:py-8 bg-[#FAF8F6] min-h-screen relative">
      {state.showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#291715] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in duration-300">
          <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-400 font-extrabold" />
          </div>
          <span className="text-xs font-black tracking-wide">{state.showToast}</span>
        </div>
      )}

      <CourseDetailModal state={state} />
      <SyncModal state={state} />

      <div className="animate-fade-in flex flex-col h-full w-full">
        <ScheduleHeader state={state} />
        <ScheduleFilters state={state} />

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between mb-8 p-4 bg-white border border-neutral-gray-200 rounded-2xl shadow-3xs print:hidden">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2"><span className="p-1 rounded-md bg-[#B3181C]/10 text-[#B3181C]"><GraduationCap className="h-3.5 w-3.5" /></span><span className="text-xs font-black text-neutral-700">CM : Cours Magistral</span></div>
            <div className="flex items-center gap-2"><span className="p-1 rounded-md bg-blue-50 text-blue-600"><FileText className="h-3.5 w-3.5" /></span><span className="text-xs font-black text-neutral-700">TD : Travaux Dirigés</span></div>
            <div className="flex items-center gap-2"><span className="p-1 rounded-md bg-green-50 text-green-600"><Laptop className="h-3.5 w-3.5" /></span><span className="text-xs font-black text-neutral-700">TP : Travaux Pratiques</span></div>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400"><Info className="h-3.5 w-3.5 text-[#B3181C] animate-pulse" /><span className="text-[10px] font-black italic tracking-wider uppercase">Cliquez sur un créneau pour voir le syllabus</span></div>
        </div>

        {state.viewMode === 'timeline' && <TimelineView state={state} />}
        {state.viewMode === 'grid' && <GridView state={state} />}

        <ScheduleMetrics />
      </div>
    </div>
  );
}

