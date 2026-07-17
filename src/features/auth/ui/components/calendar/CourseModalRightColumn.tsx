import React from 'react';
import { Video, Notebook } from 'lucide-react';

interface RightColumnProps {
  readonly selectedCourse: {
    readonly enCours?: boolean;
  };
  readonly state: {
    readonly sessionNotes: string;
    readonly isNotesSaved: boolean;
    readonly setSessionNotes: (notes: string) => void;
    readonly setIsNotesSaved: (saved: boolean) => void;
    readonly handleSaveNotes: () => void;
    readonly setSelectedCourse: (course: any) => void;
    readonly triggerToast: (msg: string) => void;
  };
}

export function CourseModalRightColumn({ selectedCourse, state }: RightColumnProps) {
  return (
    <div className="space-y-5">
      {selectedCourse.enCours && (
        <div className="bg-[#FFF5F5] border border-[#B3181C]/20 rounded-2xl space-y-3 shadow-3xs ml-[1px] pl-[8px] pr-[9px] pb-[5px] pt-[5px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B3181C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B3181C]"></span>
            </span>
            <span className="text-[9.5px] font-black text-[#B3181C] uppercase tracking-wider">
              Cours en direct en ce moment !
            </span>
          </div>
          <button 
            onClick={() => state.triggerToast("Connexion...")} 
            className="w-full py-2.5 bg-[#B3181C] hover:bg-[#961316] text-white text-[11px] font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <Video className="h-4 w-4" /> 
            <span>Rejoindre l'Amphi</span>
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Notebook className="h-3.5 w-3.5 text-[#B3181C]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Notes personnelles</span>
        </div>
        <textarea 
          value={state.sessionNotes} 
          onChange={(e) => { state.setSessionNotes(e.target.value); state.setIsNotesSaved(false); }} 
          placeholder="Saisissez vos notes ou remarques pour ce cours..."
          className="w-full h-[130px] p-4 text-[12px] font-medium bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 focus:bg-white focus:border-[#B3181C] focus:ring-2 focus:ring-[#B3181C]/5 rounded-2xl outline-none transition-all duration-250 resize-none shadow-inner mt-[8px] pl-[16px]" 
        />
        <div className="flex justify-end gap-2.5 pt-1 pl-[2px] ml-[2px] pt-[-3px] pb-[2px] mb-[5px] mt-[41px]">
          <button 
            onClick={state.handleSaveNotes} 
            disabled={state.isNotesSaved || !state.sessionNotes.trim()} 
            className={`px-4 py-2 text-[10.5px] font-black rounded-xl transition-all duration-200 ml-[0px] mr-[134px] ${
              state.isNotesSaved 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                : 'bg-[#B3181C] text-white hover:bg-[#961316] border-0 shadow-3xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none'
            }`}
          >
            {state.isNotesSaved ? 'Enregistré' : 'Enregistrer'}
          </button>
          <button 
            onClick={() => state.setSelectedCourse(null)} 
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10.5px] font-black rounded-xl transition-colors cursor-pointer border-0"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
