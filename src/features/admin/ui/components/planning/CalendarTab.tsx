import React, { useState } from 'react';
import { CalendarSlot, UnassignedCourse, DAYS, SLOTS } from '../../../domain/PlanningModels';
import { CalendarToolbar } from './CalendarToolbar';
import { UnassignedList } from './UnassignedList';
import { CalendarGridCell } from './CalendarGridCell';
import { PlanningFiltersPanel, FilterState } from './PlanningFiltersPanel';

interface Props {
  readonly slots: CalendarSlot[];
  readonly unassigned: UnassignedCourse[];
  readonly onSchedule: (courseId: string, day: string, slot: string) => void;
  readonly onMoveCourse: (slotId: string, day: string, slot: string) => void;
  readonly onDuplicateCourse: (slotId: string, day: string, slot: string) => void;
  readonly onRemoveSlot: (id: string) => void;
}

export function CalendarTab({
  slots,
  unassigned,
  onSchedule,
  onMoveCourse,
  onDuplicateCourse,
  onRemoveSlot,
}: Props) {
  const [viewMode, setViewMode] = useState<'classe' | 'salle' | 'prof'>('classe');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [filters, setFilters] = useState<FilterState>({
    anneeAcademique: 'ALL', semestre: 'ALL', faculte: 'ALL',
    departement: 'ALL', type: 'ALL', day: 'ALL', building: 'ALL'
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Apply master selector filters + combinable dropdown filters
  const filteredSlots = slots.filter((s) => {
    if (activeFilter !== 'ALL') {
      const matchMaster = viewMode === 'classe' ? s.classe === activeFilter : viewMode === 'salle' ? s.room === activeFilter : s.prof === activeFilter;
      if (!matchMaster) return false;
    }
    return (
      (filters.anneeAcademique === 'ALL' || s.anneeAcademique === filters.anneeAcademique) &&
      (filters.semestre === 'ALL' || s.semestre === filters.semestre) &&
      (filters.faculte === 'ALL' || s.faculte === filters.faculte) &&
      (filters.departement === 'ALL' || s.departement === filters.departement) &&
      (filters.type === 'ALL' || s.type === filters.type) &&
      (filters.day === 'ALL' || s.day === filters.day) &&
      (filters.building === 'ALL' || s.building === filters.building)
    );
  });

  const filterOptions = Array.from(new Set(slots.map((s) => viewMode === 'classe' ? s.classe : viewMode === 'salle' ? s.room : s.prof)));

  return (
    <div className="space-y-4" id="calendar-tab-root">
      <CalendarToolbar viewMode={viewMode} setViewMode={setViewMode} activeFilter={activeFilter} setActiveFilter={setActiveFilter} filterOptions={filterOptions} slots={filteredSlots} />
      <PlanningFiltersPanel filters={filters} onChange={setFilters} onReset={() => setFilters({ anneeAcademique: 'ALL', semestre: 'ALL', faculte: 'ALL', departement: 'ALL', type: 'ALL', day: 'ALL', building: 'ALL' })} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3 overflow-x-auto bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-neutral-200 pb-2 mb-2 text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              <div>Créneau</div>
              {DAYS.map((day) => <div key={day}>{day}</div>)}
            </div>

            {SLOTS.map((slotTime) => (
              <div key={slotTime} className="grid grid-cols-7 items-stretch min-h-[85px] border-b border-neutral-100 py-1.5">
                <div className="sticky left-0 bg-white flex flex-col justify-center items-center font-black text-neutral-500 text-[10px] pr-2 border-r border-neutral-100">
                  <span className="leading-tight text-neutral-800">{slotTime}</span>
                </div>

                {DAYS.map((day) => (
                  <CalendarGridCell
                    key={day}
                    day={day}
                    slotTime={slotTime}
                    current={filteredSlots.find((s) => s.day === day && s.slot === slotTime)}
                    onSchedule={onSchedule}
                    onMoveCourse={onMoveCourse}
                    onDuplicateCourse={onDuplicateCourse}
                    onRemoveSlot={onRemoveSlot}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <UnassignedList unassigned={unassigned} setDraggedId={setDraggedId} />
      </div>
    </div>
  );
}
