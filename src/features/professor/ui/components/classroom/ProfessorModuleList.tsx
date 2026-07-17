import React, { useState, useEffect } from 'react';
import type { CourseModule, StudentEnrolled } from '../../../domain/ProfessorModels';
import { BookOpen, FolderOpen } from 'lucide-react';
import { ModuleDetailModal } from './ModuleDetailModal';

interface Props {
  readonly modules: readonly CourseModule[];
  readonly students: readonly StudentEnrolled[];
}

export function ProfessorModuleList({ modules, students }: Props) {
  const [localModules, setLocalModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  const syncModules = React.useCallback(() => {
    const stored = localStorage.getItem('p_modules');
    if (stored) {
      const all: any[] = JSON.parse(stored);
      // Filter modules for this course
      const currentCourseId = modules[0]?.courseId;
      if (currentCourseId) {
        setLocalModules(all.filter((m) => m.courseId === currentCourseId));
      } else {
        setLocalModules([...modules]);
      }
    } else {
      setLocalModules([...modules]);
    }
  }, [modules]);

  useEffect(() => {
    syncModules();
  }, [syncModules]);

  const handleModulesUpdated = () => {
    syncModules();
  };

  return (
    <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-neutral-100/80">
      <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.22em] text-neutral-400">
        <BookOpen className="w-4 h-4 text-brand-red-deep" />
        Modules de cours
      </div>
      <div className="mt-6 space-y-4">
        {localModules.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center text-xs font-bold text-neutral-400">
            <span className="material-symbols-outlined text-3xl text-neutral-300 mb-2 block">auto_stories</span>
            Aucun module créé pour ce cours.
          </div>
        ) : (
          localModules.map((module, idx) => {
            const isDraft = module.status === 'brouillon';
            return (
              <div
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className="group relative rounded-2xl border border-neutral-150 bg-[#FAF9F6]/40 p-5 transition-all duration-300 hover:bg-white hover:shadow-md hover:border-brand-red-deep/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="font-mono text-[13px] font-black text-brand-red-deep bg-[#FFF5F5] border border-brand-red-deep/10 rounded-xl h-10 w-10 shrink-0 flex items-center justify-center shadow-3xs group-hover:bg-brand-red-deep group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-[#291715] group-hover:text-brand-red-deep transition-colors duration-200">
                        {module.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        isDraft ? 'bg-amber-50 text-amber-600 border border-amber-500/15' : 'bg-emerald-50 text-emerald-600 border border-emerald-500/15'
                      }`}>
                        {isDraft ? 'Brouillon' : 'Publié'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-xl">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <button className="px-3.5 py-1.5 rounded-xl border border-[#B3181C]/15 text-[#B3181C] text-[10px] font-black uppercase bg-white group-hover:bg-[#B3181C] group-hover:text-white group-hover:border-transparent transition-all shadow-3xs cursor-pointer flex items-center gap-1">
                    <FolderOpen className="h-3.5 w-3.5" /> Entrer & Gérer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedModule && (
        <ModuleDetailModal
          module={selectedModule}
          students={students}
          onClose={() => setSelectedModule(null)}
          onModulesUpdated={handleModulesUpdated}
        />
      )}
    </section>
  );
}
