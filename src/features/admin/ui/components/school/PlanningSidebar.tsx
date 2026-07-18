import React, { useState } from 'react';
import { Room, Classe } from '../../../domain/SchoolModels';

interface Props {
  rooms: Room[];
  classes: Classe[];
}

export function PlanningSidebar({ rooms, classes }: Props) {
  const [activeTab, setActiveTab] = useState<'teachers' | 'rooms' | 'classes'>('teachers');
  
  const teachers = [
    { id: 't1', name: 'Prof Diallo', spec: 'Génie Civil' },
    { id: 't2', name: 'Mme Sow', spec: 'Mathématiques' },
    { id: 't3', name: 'Prof Ndiaye', spec: 'Intelligence Artificielle' },
    { id: 't4', name: 'Dr Diop', spec: 'Physique & Fluides' },
  ];

  const handleDragStart = (e: React.DragEvent, type: 'teacher' | 'room' | 'class', name: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, name }));
  };

  return (
    <div className="w-64 bg-white border border-[#E2DCDA] rounded-2xl p-4 flex flex-col gap-3 shadow-sm shrink-0" id="planning-sidebar">
      <div className="flex border-b border-neutral-100 pb-1 overflow-x-auto gap-1">
        {(['teachers', 'rooms', 'classes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-2 text-[10px] font-black uppercase text-center border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab ? 'border-[#B3181C] text-[#B3181C]' : 'border-transparent text-neutral-400'
            }`}
          >
            {tab === 'teachers' ? 'Profs' : tab === 'rooms' ? 'Salles' : 'Classes'}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-neutral-400 font-bold leading-tight">
        Faites glisser un élément et déposez-le directement sur un créneau libre du planning.
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] pr-1">
        {activeTab === 'teachers' &&
          teachers.map((t) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => handleDragStart(e, 'teacher', t.name)}
              className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-2"
            >
              <span translate="no" className="material-symbols-outlined text-neutral-400 text-md">school</span>
              <div>
                <h5 className="text-[11px] font-black text-neutral-800">{t.name}</h5>
                <span className="text-[9px] text-[#B3181C] font-semibold">{t.spec}</span>
              </div>
            </div>
          ))}

        {activeTab === 'rooms' &&
          rooms.map((r) => (
            <div
              key={r.id}
              draggable
              onDragStart={(e) => handleDragStart(e, 'room', r.name)}
              className="p-3 bg-neutral-50 hover:bg-[#B3181C]/5 border border-neutral-200/60 rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-2"
            >
              <span translate="no" className="material-symbols-outlined text-neutral-400 text-md">meeting_room</span>
              <div>
                <h5 className="text-[11px] font-black text-neutral-800">{r.name}</h5>
                <span className="text-[9px] text-emerald-600 font-bold font-mono">Capacité: {r.capacity}</span>
              </div>
            </div>
          ))}

        {activeTab === 'classes' &&
          classes.map((c) => (
            <div
              key={c.id}
              draggable
              onDragStart={(e) => handleDragStart(e, 'class', c.name)}
              className="p-3 bg-neutral-50 hover:bg-[#B3181C]/5 border border-neutral-200/60 rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-2"
            >
              <span translate="no" className="material-symbols-outlined text-neutral-400 text-md">groups</span>
              <div>
                <h5 className="text-[11px] font-black text-neutral-800">{c.name}</h5>
                <span className="text-[9px] text-neutral-500 font-bold">Niveau: {c.level}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
