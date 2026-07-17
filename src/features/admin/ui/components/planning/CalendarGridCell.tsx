import React, { useState } from 'react';
import { CalendarSlot } from '../../../domain/PlanningModels';

interface Props {
  readonly day: string;
  readonly slotTime: string;
  readonly current: CalendarSlot | undefined;
  readonly onSchedule: (courseId: string, day: string, slot: string) => void;
  readonly onMoveCourse: (slotId: string, day: string, slot: string) => void;
  readonly onDuplicateCourse: (slotId: string, day: string, slot: string) => void;
  readonly onRemoveSlot: (id: string) => void;
}

export function CalendarGridCell({
  day,
  slotTime,
  current,
  onSchedule,
  onMoveCourse,
  onDuplicateCourse,
  onRemoveSlot,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const cellId = `${day}-${slotTime}`;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const unassignedId = e.dataTransfer.getData('courseId');
    const movingSlotId = e.dataTransfer.getData('movingSlotId');
    const isAltKey = e.altKey || e.ctrlKey;

    if (unassignedId) {
      onSchedule(unassignedId, day, slotTime);
    } else if (movingSlotId) {
      if (isAltKey) {
        onDuplicateCourse(movingSlotId, day, slotTime);
      } else {
        onMoveCourse(movingSlotId, day, slotTime);
      }
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`mx-1 p-2 rounded-xl border border-dashed flex flex-col justify-between transition-all select-none ${
        current
          ? 'bg-[#B3181C]/5 border-[#B3181C]/30 text-neutral-800'
          : dragOver
          ? 'bg-emerald-50 border-emerald-400 scale-[1.02]'
          : 'bg-neutral-50/40 border-neutral-200 hover:bg-neutral-100/50'
      }`}
      style={{ minHeight: '85px' }}
    >
      {current ? (
        <div
          draggable
          onDragStart={(e) => { e.dataTransfer.setData('movingSlotId', current.id); }}
          className="relative group h-full flex flex-col justify-between cursor-grab active:cursor-grabbing"
        >
          <div>
            <div className="flex justify-between items-start gap-1">
              <div className="font-extrabold text-[10px] text-[#1E293B] leading-tight line-clamp-2">
                {current.subject}
              </div>
              <span className={`text-[7px] font-black px-1 rounded uppercase shrink-0 ${
                current.type === 'CM' ? 'bg-[#B3181C]/10 text-[#B3181C]' :
                current.type === 'TD' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {current.type}
              </span>
            </div>
            <div className="text-[8px] font-black text-neutral-500 uppercase mt-0.5">
              {current.classe}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[8px] font-bold text-neutral-400 truncate max-w-[70px]" title={current.prof}>
              {current.prof}
            </span>
            <span className="text-[7px] font-black bg-[#1E293B] text-white px-1 py-0.5 rounded">
              {current.room}
            </span>
          </div>

          {/* Action quick buttons shown on hover */}
          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 bg-white p-0.5 rounded-lg border border-neutral-200 shadow-sm z-20">
            <button
              onClick={() => onDuplicateCourse(current.id, day, slotTime)}
              className="bg-neutral-100 text-neutral-600 hover:bg-emerald-500 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
              title="Dupliquer (Alt + Glisser)"
            >
              <span translate="no" className="material-symbols-outlined text-[10px]">content_copy</span>
            </button>
            <button
              onClick={() => onRemoveSlot(current.id)}
              className="bg-neutral-100 text-neutral-600 hover:bg-rose-600 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
              title="Retirer le cours"
            >
              <span translate="no" className="material-symbols-outlined text-[10px]">close</span>
            </button>
          </div>
        </div>
      ) : (
        <span className="text-[8px] text-neutral-300 font-extrabold text-center my-auto uppercase tracking-widest pointer-events-none">
          Déposer
        </span>
      )}
    </div>
  );
}
