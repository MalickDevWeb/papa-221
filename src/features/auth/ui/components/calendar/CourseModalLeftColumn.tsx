import React from 'react';
import { MapPin, User, FileDown, QrCode, CheckCircle } from 'lucide-react';

interface LeftColumnProps {
  readonly selectedCourse: {
    readonly id: string;
    readonly salle: string;
    readonly professeur: string;
    readonly syllabus: string;
  };
  readonly state: {
    readonly presenceSuccess: boolean;
    readonly handleDownloadMaterials: (id: string) => void;
    readonly setShowQRModal: (show: boolean) => void;
  };
}

export function CourseModalLeftColumn({ selectedCourse, state }: LeftColumnProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-200/60 flex items-center gap-3">
          <MapPin className="h-4 w-4 text-[#B3181C]" />
          <span className="text-xs font-bold text-neutral-750">{selectedCourse.salle}</span>
        </div>
        <div className="bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-200/60 flex items-center gap-3">
          <User className="h-4 w-4 text-[#B3181C]" />
          <span className="text-xs font-bold text-neutral-750">{selectedCourse.professeur}</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">Syllabus</span>
        <p className="text-[12px] bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200/60 font-medium text-neutral-600 leading-relaxed">
          {selectedCourse.syllabus}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 pb-2">
        <button 
          onClick={() => state.handleDownloadMaterials(selectedCourse.id)} 
          className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-[#FFF5F5] border border-neutral-200 hover:border-[#B3181C]/20 rounded-2xl text-xs font-bold text-neutral-700 hover:text-[#B3181C] transition-all duration-200 shadow-3xs cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-[11.5px]">
            <FileDown className="h-4 w-4 text-[#B3181C]" /> 
            <span>Cours_Supports.pdf</span>
          </span>
          <span className="text-[10px] font-black uppercase text-neutral-400 group-hover:text-[#B3181C] tracking-wide">Télécharger</span>
        </button>

        {state.presenceSuccess ? (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Présence validée !</span>
          </div>
        ) : (
          <button 
            onClick={() => state.setShowQRModal(true)} 
            className="w-full flex items-center justify-center gap-1.5 p-3.5 bg-[#B3181C] hover:bg-[#961316] text-white rounded-2xl text-xs font-black cursor-pointer transition-colors duration-200 shadow-sm"
          >
            <QrCode className="h-4 w-4" /> 
            <span>Flasher Présence</span>
          </button>
        )}
      </div>
    </div>
  );
}
