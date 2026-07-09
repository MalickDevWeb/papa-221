import React from 'react';
import { Icon } from '@iconify/react';

interface ActiveSession {
  id: string;
  title: string;
  hlsUrl: string;
}

interface ProfessorActiveMeetViewProps {
  readonly active: ActiveSession;
  readonly stopMeet: (id: string) => Promise<void>;
  readonly profName: string;
}

export function ProfessorActiveMeetView({ active, stopMeet }: ProfessorActiveMeetViewProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
        <div>
          <span className="text-[8.5px] font-black uppercase text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-md inline-block mb-1">Google Meet Actif</span>
          <h5 className="font-bold text-xs text-neutral-800 leading-tight">{active.title}</h5>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={active.hlsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl font-bold text-[10px] flex items-center gap-1.5 transition-all shadow-sm hover:scale-102 active:scale-98"
          >
            <Icon icon="logos:google-meet" className="h-3.5 w-3.5 brightness-0 invert" />
            <span>Rejoindre la réunion</span>
          </a>
          <button
            onClick={() => stopMeet(active.id)}
            className="px-3.5 py-2 bg-[#B3181C] hover:bg-[#8c1215] text-white rounded-xl font-bold text-[10px] cursor-pointer transition-all hover:scale-102 active:scale-98"
          >
            Terminer le cours
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessorActiveMeetView;
