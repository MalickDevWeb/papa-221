import type { ProfessorCourse } from '../../../domain/ProfessorModels';
import { Plus } from 'lucide-react';

interface Props {
  readonly selectedCourse?: ProfessorCourse | null;
  readonly isAddingModule: boolean;
  readonly setIsAddingModule: (value: boolean) => void;
}

export function ProfessorClassroomHeader({ selectedCourse, isAddingModule, setIsAddingModule }: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-neutral-100/80 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF5F5] border border-[#B3181C]/10 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-brand-red-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red-deep animate-pulse" />
            Espace Classe
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#291715] tracking-tight">
            {selectedCourse?.titre ?? 'Sélectionnez une classe'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-neutral-400">meeting_room</span>
              Salle : <strong className="text-neutral-700 font-semibold">{selectedCourse?.salle ?? '—'}</strong>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-neutral-400">star</span>
              Coefficient : <strong className="text-neutral-700 font-semibold">{selectedCourse?.coefficient ?? '—'}</strong>
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsAddingModule(!isAddingModule)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black text-white transition-all duration-200 shadow-sm active:scale-95 cursor-pointer ${
            isAddingModule 
              ? 'bg-[#291715] hover:bg-[#1E100E]' 
              : 'bg-brand-red-deep hover:bg-brand-red-deep/90 hover:shadow-md hover:shadow-[#B3181C]/10'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {isAddingModule ? 'Fermer le formulaire' : 'Nouveau module'}
        </button>
      </div>
    </section>
  );
}
