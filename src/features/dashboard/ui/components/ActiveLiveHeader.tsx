import React from 'react';
import { Icon } from '@iconify/react';
import { LiveSession } from '@/features/student/types';

interface ActiveLiveHeaderProps {
  readonly selectedLive: LiveSession;
  readonly onQuit: () => void;
}

export function ActiveLiveHeader({ selectedLive, onQuit }: ActiveLiveHeaderProps) {
  return (
    <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 z-10 flex justify-between items-start">
      <div>
        <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest w-fit animate-pulse shadow-sm shadow-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          EN DIRECT • AMPHI A
        </span>
        <h4 className="text-sm font-black text-white leading-tight mt-1 truncate max-w-[340px]">{selectedLive.title}</h4>
        <p className="text-[10px] text-white/70 font-heavy">{selectedLive.courseName} • Enseigné par {selectedLive.teacherName}</p>
      </div>
      <button 
        onClick={onQuit}
        className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white font-bold transition-colors cursor-pointer flex items-center gap-1 text-xs"
      >
        <Icon icon="lucide:arrow-left" className="h-4 w-4" /> Quitter
      </button>
    </div>
  );
}
