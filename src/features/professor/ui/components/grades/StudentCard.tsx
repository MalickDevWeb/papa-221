import React from 'react';
import type { StudentGrade } from '../../../domain/ProfessorModels';
import { Award, ChevronRight } from 'lucide-react';

interface Props {
  readonly grade: StudentGrade;
  readonly onClick: () => void;
}

export function StudentCard({ grade, onClick }: Props) {
  const finalGrade = grade.finalGrade;
  const isPass = finalGrade >= 10;
  const initials = grade.studentNom
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl border border-neutral-100 hover:border-brand-red-deep/20 hover:shadow-md transition-all duration-300 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-2xl bg-neutral-100 group-hover:bg-[#FFF5F5] flex items-center justify-center text-xs font-black text-neutral-600 group-hover:text-brand-red-deep border border-neutral-200/40 group-hover:border-brand-red-deep/10 transition-colors shrink-0 shadow-3xs">
          {initials}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-neutral-800 group-hover:text-brand-red-deep transition-colors">
            {grade.studentNom}
          </h4>
          <span className="text-[10px] text-neutral-400 font-bold bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-lg">
            Matricule : {grade.studentId.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4.5">
        <div className="flex items-center gap-3.5 bg-[#FAF9F6] border border-neutral-100 p-2 px-3 rounded-xl">
          <div className="text-center min-w-8">
            <span className="block text-[8px] font-black uppercase text-neutral-400">CC</span>
            <span className="text-xs font-black text-neutral-700">{grade.cc}</span>
          </div>
          <span className="text-neutral-200">|</span>
          <div className="text-center min-w-8">
            <span className="block text-[8px] font-black uppercase text-neutral-400">Exam</span>
            <span className="text-xs font-black text-neutral-700">{grade.examen}</span>
          </div>
          <span className="text-neutral-200">|</span>
          <div className="text-center min-w-8">
            <span className="block text-[8px] font-black uppercase text-brand-red-deep">Note</span>
            <span className="text-xs font-black text-brand-red-deep">{finalGrade}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isPass 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/10' 
              : 'bg-amber-50 text-amber-700 border border-amber-500/10'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isPass ? 'Validé' : 'Rattrapage'}
          </span>

          <button className="h-8 w-8 rounded-xl bg-[#FFF5F5] group-hover:bg-brand-red-deep flex items-center justify-center text-brand-red-deep group-hover:text-white border border-[#B3181C]/10 group-hover:border-transparent transition-all duration-300">
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
