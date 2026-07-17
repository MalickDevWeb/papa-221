import React from 'react';
import { X } from 'lucide-react';

interface HeaderProps {
  readonly selectedCourse: {
    readonly jourNom: string;
    readonly heure: string;
    readonly type: string;
    readonly nom: string;
  };
  readonly classLabel: string;
  readonly onClose: () => void;
}

export function CourseModalHeader({ selectedCourse, classLabel, onClose }: HeaderProps) {
  return (
    <div className="bg-gradient-to-br from-[#B3181C] to-[#8e1215] text-white p-6 pb-5 relative">
      <button 
        onClick={onClose} 
        className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer border-0"
      >
        <X className="text-white w-[20px] h-[20px] pr-[-1px] pl-[0px] pt-[0px] ml-[1px] mr-[-1px] mt-[2px] mb-[7px]" />
      </button>
      
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <span className="font-extrabold uppercase text-[10px] tracking-wider text-white/80">
          {selectedCourse.jourNom} · {selectedCourse.heure}
        </span>
        <div className="flex gap-1.5 items-center">
          <span className="bg-white/15 border border-white/20 text-[8.5px] font-black uppercase tracking-widest rounded-md pt-[2px] pl-[13px] ml-[12px] pb-[3px] pr-[6px]">
            {classLabel}
          </span>
          <span className="bg-white/25 border border-white/30 text-[8.5px] font-black uppercase tracking-widest py-0.5 rounded-md text-white pl-2.5 pr-[10px] mr-[34px]">
            {selectedCourse.type}
          </span>
        </div>
      </div>
      
      <h3 className="font-sans font-black text-lg md:text-xl tracking-tight leading-snug">
        {selectedCourse.nom}
      </h3>
    </div>
  );
}
