import React, { useState } from 'react';
import { PlanningSlot } from '../../../domain/SchoolModels';

interface Props {
  slots: PlanningSlot[];
  viewMode: 'class' | 'room';
  selectedId: string;
  onDropItem: (day: string, slot: string, item: { type: 'teacher' | 'room' | 'class'; name: string }) => void;
  onClearCell: (day: string, slot: string) => void;
  onSelectSlot?: (slot: PlanningSlot) => void;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIMES = ['08h - 10h', '10h - 12h', '12h - 14h', '14h - 16h', '16h - 18h', '18h - 20h'];

export function PlanningGrid({ slots, viewMode, selectedId, onDropItem, onClearCell, onSelectSlot }: Props) {
  const [dragOverCell, setDragOverCell] = useState<{ day: string; slot: string } | null>(null);

  const handleDrop = (e: React.DragEvent, day: string, slotName: string) => {
    e.preventDefault();
    setDragOverCell(null);
    try {
      const parsed = JSON.parse(e.dataTransfer.getData('application/json'));
      if (parsed?.type && parsed?.name) {
        onDropItem(day, slotName, { type: parsed.type, name: parsed.name });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 bg-white border border-[#E2DCDA] rounded-2xl p-4 shadow-sm overflow-hidden flex flex-col" id="planning-grid">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="w-24 py-2 px-3 text-[10px] uppercase font-black text-neutral-400">Horaire</th>
              {DAYS.map(d => <th key={d} className="py-2 px-3 text-[10px] uppercase font-black text-neutral-400 text-center">{d}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {TIMES.map(time => (
              <tr key={time} className="h-20 hover:bg-neutral-50/20">
                <td className="py-2 px-3 text-[10px] font-bold text-neutral-500">{time}</td>
                {DAYS.map(day => {
                  const cellSlot = slots.find(s => viewMode === 'class'
                    ? s.classeId === selectedId && s.day === day && s.slot === time
                    : s.roomName === selectedId && s.day === day && s.slot === time
                  );
                  const isOver = dragOverCell?.day === day && dragOverCell?.slot === time;
                  return (
                    <td
                      key={day}
                      onDragOver={e => { e.preventDefault(); if (dragOverCell?.day !== day || dragOverCell?.slot !== time) setDragOverCell({ day, slot: time }); }}
                      onDragLeave={() => setDragOverCell(null)}
                      onDrop={e => handleDrop(e, day, time)}
                      className={`p-2 transition-all relative group ${isOver ? 'bg-[#B3181C]/5 ring-2 ring-dashed ring-[#B3181C]' : 'border-r border-neutral-100/50'}`}
                    >
                      {cellSlot ? (
                        <div
                          onClick={() => onSelectSlot?.(cellSlot)}
                          className={`h-full w-full border rounded-xl p-2 flex flex-col justify-between relative select-none cursor-pointer transition-all ${
                            cellSlot.status === 'annule' || cellSlot.isAbsent || (cellSlot as any).isCancelled
                              ? 'bg-red-50/65 hover:bg-red-100/60 border-red-200/80 shadow-3xs'
                              : 'bg-neutral-50 hover:bg-neutral-100/70 border-neutral-200/80 hover:border-neutral-300'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <div className={`text-[10px] font-black truncate leading-tight flex-1 ${
                                cellSlot.status === 'annule' || cellSlot.isAbsent || (cellSlot as any).isCancelled
                                  ? 'text-red-950 line-through opacity-80'
                                  : 'text-[#1E293B]'
                              }`}>
                                {viewMode === 'class' ? (cellSlot.subject || 'Cours') : cellSlot.classeId}
                              </div>
                              {(cellSlot.status === 'annule' || cellSlot.isAbsent || (cellSlot as any).isCancelled) && (
                                <span className="text-[7px] font-black bg-red-100/80 text-red-700 px-1 py-0.5 rounded shrink-0 uppercase tracking-wide">Absent</span>
                              )}
                            </div>
                            <div className="text-[9px] text-neutral-500 font-bold truncate mt-0.5">👨‍🏫 {cellSlot.prof || 'Non assigné'}</div>
                            {viewMode === 'class' && <div className="text-[9px] text-[#B3181C] font-extrabold truncate">📍 {cellSlot.roomName || 'Sans salle'}</div>}
                            {(cellSlot.status === 'annule' || cellSlot.isAbsent || (cellSlot as any).isCancelled) && cellSlot.cancellationReason && (
                              <div className="text-[8px] text-red-600 font-bold italic truncate mt-0.5">📝 {cellSlot.cancellationReason}</div>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClearCell(day, time);
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B3181C] cursor-pointer shadow-sm flex items-center justify-center z-10"
                          >
                            <span translate="no" className="material-symbols-outlined text-[10px] font-black">close</span>
                          </button>
                        </div>
                      ) : <div className="h-full w-full rounded-xl border border-dashed border-neutral-200 flex items-center justify-center text-[9px] text-neutral-300 font-semibold italic">Libre</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
