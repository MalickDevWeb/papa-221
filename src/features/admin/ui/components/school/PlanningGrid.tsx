import React, { useState } from 'react';
import { PlanningSlot } from '../../../domain/SchoolModels';

interface Props {
  slots: PlanningSlot[];
  viewMode: 'class' | 'room';
  selectedId: string;
  onDropItem: (day: string, slot: string, item: { type: 'teacher' | 'room'; name: string }) => void;
  onClearCell: (day: string, slot: string) => void;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIMES = ['08h - 10h', '10h - 12h', '12h - 14h', '14h - 16h', '16h - 18h', '18h - 20h'];

export function PlanningGrid({ slots, viewMode, selectedId, onDropItem, onClearCell }: Props) {
  const [dragOverCell, setDragOverCell] = useState<{ day: string; slot: string } | null>(null);

  const handleDrop = (e: React.DragEvent, day: string, slotName: string) => {
    e.preventDefault();
    setDragOverCell(null);
    try {
      const parsed = JSON.parse(e.dataTransfer.getData('application/json'));
      if (parsed?.type && parsed?.name) onDropItem(day, slotName, { type: parsed.type, name: parsed.name });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 bg-white border border-[#E2DCDA] rounded-2xl p-4 shadow-sm overflow-hidden flex flex-col">
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
                        <div className="h-full w-full bg-neutral-50 border border-neutral-200/80 rounded-xl p-2 flex flex-col justify-between relative select-none">
                          <div>
                            <div className="text-[10px] font-black text-[#1E293B] truncate leading-tight">{viewMode === 'class' ? (cellSlot.subject || 'Cours') : cellSlot.classeId}</div>
                            <div className="text-[9px] text-neutral-500 font-bold truncate mt-0.5">👨‍🏫 {cellSlot.prof || 'Non assigné'}</div>
                            {viewMode === 'class' && <div className="text-[9px] text-[#B3181C] font-extrabold truncate">📍 {cellSlot.roomName || 'Sans salle'}</div>}
                          </div>
                          <button onClick={() => onClearCell(day, time)} className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B3181C] cursor-pointer shadow-sm flex items-center justify-center">
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

