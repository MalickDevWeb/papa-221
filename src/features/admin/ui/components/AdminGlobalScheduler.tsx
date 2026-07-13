import React, { useState } from 'react';
import { PlanningSubSidebar } from './planning/PlanningSubSidebar';
import { CalendarTab } from './planning/CalendarTab';
import { ConflictsTab } from './planning/ConflictsTab';
import { AssistantIaTab } from './planning/AssistantIaTab';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';
import { CalendarSlot, UnassignedCourse, ConflictAlert, INITIAL_SLOTS, INITIAL_UNASSIGNED, INITIAL_CONFLICTS } from '../../domain/PlanningModels';

export function AdminGlobalScheduler() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [slots, setSlots] = useState<CalendarSlot[]>(INITIAL_SLOTS);
  const [unassigned, setUnassigned] = useState<UnassignedCourse[]>(INITIAL_UNASSIGNED);
  const [conflicts, setConflicts] = useState<ConflictAlert[]>(INITIAL_CONFLICTS);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSchedule = (courseId: string, day: string, slotTime: string) => {
    const course = unassigned.find((c) => c.id === courseId);
    if (!course) return;
    const dup = slots.find((s) => s.day === day && s.slot === slotTime && (s.room === course.room || s.prof === course.prof || s.classe === course.classe));
    if (dup) {
      setConflicts([{ id: `${Date.now()}`, type: 'Salle', message: `Conflit détecté le ${day} à ${slotTime}`, timestamp: 'À l\'instant', severity: 'high' }, ...conflicts]);
      showToast(`Conflit détecté !`, false);
      return;
    }
    setSlots([...slots, { id: `slot-${Date.now()}`, subject: course.subject, prof: course.prof, room: course.room, classe: course.classe, day, slot: slotTime, type: 'matin' }]);
    setUnassigned(unassigned.filter((c) => c.id !== courseId));
    showToast(`Cours planifié !`, true);
  };

  const removeSlot = (id: string) => {
    const item = slots.find((s) => s.id === id);
    if (item) {
      setUnassigned([...unassigned, { id: `un-${Date.now()}`, subject: item.subject, prof: item.prof, room: item.room, classe: item.classe, duration: '2h' }]);
    }
    setSlots(slots.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-start w-full" id="global-scheduler-root">
      {!isClosed ? (
        <TabletDrawerWrapper>
          <PlanningSubSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onClose={() => setIsClosed(true)}
          />
        </TabletDrawerWrapper>
      ) : (
        <button
          onClick={() => setIsClosed(false)}
          className="bg-white border border-[#E2DCDA] hover:bg-neutral-50 text-[#1E293B] px-3.5 py-4 rounded-2xl shadow-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer font-black shrink-0 w-16 group hover:border-[#B3181C]"
          title="Afficher les filtres et options"
        >
          <span translate="no" className="material-symbols-outlined text-lg font-bold text-[#B3181C] group-hover:scale-110 transition-transform">
            visibility
          </span>
          <span className="uppercase tracking-widest text-[8px] text-neutral-400 font-black">Filtres</span>
        </button>
      )}

      <div className="flex-grow min-w-0 w-full bg-white border border-[#E2DCDA] rounded-2xl p-3 sm:p-6 shadow-sm min-h-[500px] relative">
        {toast && (
          <div className={`absolute top-4 right-4 z-50 px-4 py-2 rounded-xl border text-xs font-black shadow-md flex items-center gap-2 ${toast.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            <span translate="no" className="material-symbols-outlined text-sm">{toast.success ? 'check_circle' : 'error'}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {activeTab === 'calendar' && <CalendarTab slots={slots} unassigned={unassigned} onSchedule={handleSchedule} onRemoveSlot={removeSlot} />}
        {activeTab === 'conflicts' && <ConflictsTab conflicts={conflicts} onClearConflict={(id) => setConflicts(conflicts.filter((c) => c.id !== id))} onClearAll={() => setConflicts([])} />}
        {activeTab === 'ai_opt' && <AssistantIaTab onApplyIaSchedule={(newSlots, info) => { setSlots([...slots, ...newSlots]); showToast(info, true); }} />}
      </div>
    </div>
  );
}
