import type { FormEvent } from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  readonly isAddingModule: boolean;
  readonly newModuleTitle: string;
  readonly newModuleDesc: string;
  readonly setNewModuleTitle: (value: string) => void;
  readonly setNewModuleDesc: (value: string) => void;
  readonly handleCreateModule: (e: FormEvent) => Promise<void>;
}

export function ProfessorModuleForm({
  isAddingModule,
  newModuleTitle,
  newModuleDesc,
  setNewModuleTitle,
  setNewModuleDesc,
  handleCreateModule,
}: Props) {
  if (!isAddingModule) return null;

  return (
    <section className="rounded-3xl bg-neutral-gray-50 p-6 border border-neutral-gray-200 shadow-sm">
      <div className="flex items-center gap-2 text-brand-red-deep text-xs font-black uppercase tracking-[0.22em]">
        <BookOpen className="w-4 h-4" />
        Créer un module
      </div>
      <form onSubmit={handleCreateModule} className="mt-5 space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-secondary">Titre du module</label>
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="Ex: Module 1 — Algorithmes avancés"
            className="mt-2 w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold focus:border-brand-red-deep focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-secondary">Description</label>
          <textarea
            value={newModuleDesc}
            onChange={(e) => setNewModuleDesc(e.target.value)}
            rows={3}
            placeholder="Objectifs pédagogiques du module"
            className="mt-2 w-full rounded-2xl border border-neutral-gray-300 bg-white px-4 py-3 text-xs font-semibold focus:border-brand-red-deep focus:outline-none resize-none"
          />
        </div>
        <button type="submit" className="rounded-2xl bg-brand-red-deep px-4 py-3 text-xs font-black text-white hover:bg-[#6B0E10] transition">
          Publier le module
        </button>
      </form>
    </section>
  );
}
