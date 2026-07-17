import React, { useState } from 'react';
import { CalendarSlot, UnassignedCourse, DAYS, SLOTS } from '../../../domain/PlanningModels';
import { CalendarToolbar } from './CalendarToolbar';
import { UnassignedList } from './UnassignedList';
import { useDeviceStore } from '@/features/screenguard/hooks/useDeviceStore';
import { MobileSchedulerView } from '@/features/screenguard/ui/components/MobileSchedulerView';
import { TabletSchedulerView } from '@/features/screenguard/ui/components/TabletSchedulerView';

interface Props {
  slots: CalendarSlot[];
  unassigned: UnassignedCourse[];
  onSchedule: (courseId: string, day: string, slot: string) => void;
  onRemoveSlot: (id: string) => void;
}

export function CalendarTab({ slots, unassigned, onSchedule, onRemoveSlot }: Props) {
  const { isMobile, isTablet } = useDeviceStore();
  const [viewMode, setViewMode] = useState<'classe' | 'salle' | 'prof'>('classe');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  if (isMobile) {
    return <MobileSchedulerView slots={slots} />;
  }

  if (isTablet) {
    return (
      <TabletSchedulerView
        slots={slots}
        unassigned={unassigned}
        onSchedule={onSchedule}
        onRemoveSlot={onRemoveSlot}
      />
    );
  }

  const currentSlots = activeFilter === 'ALL' ? slots : slots.filter((s) => (viewMode === 'classe' ? s.classe === activeFilter : viewMode === 'salle' ? s.room === activeFilter : s.prof === activeFilter));
  const filterOptions = Array.from(new Set(slots.map((s) => viewMode === 'classe' ? s.classe : viewMode === 'salle' ? s.room : s.prof)));

  return (
    <div className="space-y-4" id="calendar-tab-root">
      <CalendarToolbar viewMode={viewMode} setViewMode={setViewMode} activeFilter={activeFilter} setActiveFilter={setActiveFilter} filterOptions={filterOptions} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3 overflow-x-auto bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-6 border-b border-neutral-200 pb-2 mb-2 text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              <div>Créneau</div>
              {DAYS.map((day) => <div key={day}>{day}</div>)}
            </div>

            {SLOTS.map((slotTime) => (
              <div key={slotTime} className="grid grid-cols-6 items-stretch min-h-[85px] border-b border-neutral-100 py-1.5">
                <div className="sticky left-0 bg-white flex flex-col justify-center items-center font-black text-neutral-500 text-[10px] pr-2 border-r border-neutral-100">
                  <span className="leading-tight text-neutral-800">{slotTime}</span>
                </div>

                {DAYS.map((day) => {
                  const cellId = `${day}-${slotTime}`;
                  const current = currentSlots.find((s) => s.day === day && s.slot === slotTime);
                  const isOver = dragOverCell === cellId;

                  return (
                    <div
                      key={day}
                      onDragOver={(e) => { e.preventDefault(); setDragOverCell(cellId); }}
                      onDragLeave={() => setDragOverCell(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverCell(null);
                        const id = e.dataTransfer.getData('courseId') || draggedId;
                        if (id) onSchedule(id, day, slotTime);
                      }}
                      className={`mx-1 p-2 rounded-xl border border-dashed flex flex-col justify-between transition-all ${
                        current ? 'bg-[#B3181C]/5 border-[#B3181C]/30 text-neutral-800' : isOver ? 'bg-emerald-50 border-emerald-400 scale-[1.02]' : 'bg-neutral-50/40 border-neutral-200 hover:bg-neutral-100/50'
                      }`}
                    >
                      {current ? (
                        <div className="relative group h-full flex flex-col justify-between">
                          <div>
                            <div className="font-extrabold text-[10px] text-[#1E293B] leading-tight line-clamp-2">{current.subject}</div>
                            <div className="text-[8px] font-black text-[#B3181C] uppercase mt-0.5">{current.classe}</div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-neutral-400 truncate max-w-[70px]">{current.prof}</span>
                            <span className="text-[7px] font-black bg-[#1E293B] text-white px-1.5 py-0.5 rounded">{current.room}</span>
                          </div>
                          <button onClick={() => onRemoveSlot(current.id)} className="absolute -top-1 -right-1 bg-neutral-200 text-neutral-600 hover:bg-rose-600 hover:text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"><span translate="no" className="material-symbols-outlined text-[10px]">close</span></button>
                        </div>
                      ) : (
                        <span className="text-[8px] text-neutral-300 font-extrabold text-center my-auto select-none uppercase tracking-widest">Déposer</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <UnassignedList unassigned={unassigned} setDraggedId={setDraggedId} />
      </div>
    </div>
  );
}
