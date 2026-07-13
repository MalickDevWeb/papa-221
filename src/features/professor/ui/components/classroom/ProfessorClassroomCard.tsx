import React from 'react';
import { BookOpen, MapPin, Calendar, Shield } from 'lucide-react';
import type { ProfessorCourse } from '../../../domain/ProfessorModels';

interface CardProps {
  readonly course: ProfessorCourse;
  readonly isSelected: boolean;
  readonly onSelect: (id: string) => void;
}

export function ProfessorClassroomCard({ course, isSelected, onSelect }: CardProps) {
  const isSec = course.id.includes('4');
  return (
    <div
      onClick={() => onSelect(course.id)}
      className={`group ml-0 pl-3 pr-[14px] pt-3 pb-[13px] rounded-[24px] border transition-all duration-300 cursor-pointer select-none relative flex flex-col justify-between min-h-[185px] shadow-[0_2px_12px_rgba(0,0,0,0.015)] ${
        isSelected
          ? 'bg-gradient-to-b from-white to-[#FFFDFD] border-[#B3181C] ring-2 ring-[#B3181C]/5 shadow-md scale-100'
          : 'bg-white border-neutral-200 hover:border-[#B3181C]/40 hover:shadow-lg hover:-translate-y-0.5'
      } active:scale-[0.98]`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[#B3181C] text-white p-0.5 rounded-full shadow-sm z-10">
          <span translate="no" className="material-symbols-outlined text-[13px] block font-black">check</span>
        </div>
      )}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <div className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-[#B3181C]/10 text-[#B3181C]' : 'bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10'}`}>
            {isSec ? <Shield className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
          </div>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors ${isSelected ? 'bg-[#B3181C]/10 text-[#B3181C]' : 'bg-neutral-50 text-neutral-500 border border-neutral-200/50'}`}>
            Coef. {course.coefficient}
          </span>
          {course.classe && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase bg-[#FFF5F5] text-[#B3181C] border border-[#B3181C]/10">
              {course.classe}
            </span>
          )}
        </div>
        <h4 className={`text-[13.5px] font-black tracking-tight leading-snug line-clamp-2 pr-5 transition-colors ${isSelected ? 'text-[#B3181C]' : 'text-neutral-800 group-hover:text-[#B3181C]'}`}>
          {course.titre}
        </h4>
      </div>
      <div className="mt-3 pt-2.5 border-t border-neutral-100 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
          <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 animate-pulse" />
          <span className="truncate text-neutral-600">Salle: {course.salle}</span>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] font-semibold text-neutral-400">
          <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
          <span className="truncate text-neutral-500">Suivant: {course.prochainCours}</span>
        </div>
        <div className="pt-1">
          <div className="flex items-center justify-between text-[8.5px] font-extrabold uppercase tracking-wider text-neutral-400">
            <span>Progression</span>
            <span className={isSelected ? 'text-[#B3181C]' : 'text-neutral-500'}>{course.progress}%</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden mt-0.5">
            <div className={`h-full rounded-full transition-all ${isSelected ? 'bg-[#B3181C]' : 'bg-[#B3181C]/75'}`} style={{ width: `${course.progress}%` }} />
          </div>
        </div>
        {/* Quick Action using Material Symbols as requested */}
        <div className="pt-2 mt-1 flex items-center justify-between border-t border-neutral-100/60">
          {isSelected ? (
            <span className="text-[10px] text-[#B3181C] font-black uppercase tracking-wider flex items-center gap-1">
              <span translate="no" className="material-symbols-outlined text-[15px] font-bold">meeting_room</span>
              Entrer dans la salle
            </span>
          ) : (
            <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider flex items-center gap-1 group-hover:text-[#B3181C] transition-colors">
              <span translate="no" className="material-symbols-outlined text-[15px]">visibility</span>
              Voir les détails
            </span>
          )}
          <span translate="no" className={`material-symbols-outlined text-[14px] font-black transition-all ${isSelected ? 'text-[#B3181C] animate-pulse' : 'text-neutral-300 group-hover:text-[#B3181C] group-hover:translate-x-1'}`}>
            arrow_right_alt
          </span>
        </div>
      </div>
    </div>
  );
}
