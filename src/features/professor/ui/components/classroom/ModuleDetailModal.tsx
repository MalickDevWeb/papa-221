import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Settings, FileText, HelpCircle, Clipboard } from 'lucide-react';
import { ModuleGeneralSection } from './ModuleGeneralSection';
import { ModuleLessonsSection } from './ModuleLessonsSection';
import { ModuleQuizSection } from './ModuleQuizSection';
import { ModuleHomeworkSection } from './ModuleHomeworkSection';
import { ModuleSequencesSection } from './ModuleSequencesSection';
import type { CourseModule, StudentEnrolled } from '../../../domain/ProfessorModels';

interface Props {
  readonly module: CourseModule & { readonly status?: 'brouillon' | 'publie' };
  readonly students: readonly StudentEnrolled[];
  readonly onClose: () => void;
  readonly onModulesUpdated: () => void;
}

export function ModuleDetailModal({ module, students, onClose, onModulesUpdated }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'lessons' | 'quizzes' | 'homework' | 'sequences'>('info');
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [isDraft, setIsDraft] = useState(module.status === 'brouillon');

  const handleSaveModule = () => {
    const stored = localStorage.getItem('p_modules');
    if (stored) {
      const all: any[] = JSON.parse(stored);
      const idx = all.findIndex((m) => m.id === module.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], title, description, status: isDraft ? 'brouillon' : 'publie' };
        localStorage.setItem('p_modules', JSON.stringify(all));
        onModulesUpdated();
      }
    }
  };

  return (
    <div className="bg-white w-full rounded-3xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col animate-fade-in select-none">
      <div className="bg-gradient-to-br from-brand-red-deep to-[#291715] px-6 py-4.5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 animate-fade-in">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider cursor-pointer border-0 transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>
          <div className="h-5 w-[1px] bg-white/20 hidden sm:block shrink-0"></div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-white/90 animate-pulse shrink-0" />
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/70 block leading-none">E-Learning & Module</span>
              <h3 className="text-xs sm:text-sm font-black tracking-tight mt-1">{module.title}</h3>
            </div>
          </div>
        </div>
      </div>

        {/* Tab Selection Navigation */}
        <div className="bg-neutral-50 px-6 py-2.5 border-b border-neutral-200/60 flex flex-wrap gap-2 shrink-0">
          {[
            { id: 'info', label: 'Infos & Exercices', icon: Settings },
            { id: 'lessons', label: 'Chapitres & Leçons', icon: FileText },
            { id: 'quizzes', label: 'Quiz & QCM', icon: HelpCircle },
            { id: 'homework', label: 'Devoirs & Notes', icon: Clipboard },
            { id: 'sequences', label: 'Séquences & Suivi', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer border border-transparent ${
                  isSel ? 'bg-brand-red-deep text-white shadow-3xs' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-150/40'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {activeTab === 'info' && (
            <ModuleGeneralSection
              module={module}
              students={students}
              title={title}
              description={description}
              isDraft={isDraft}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onToggleDraft={() => setIsDraft(!isDraft)}
              onSaveModule={handleSaveModule}
            />
          )}
          {activeTab === 'lessons' && <ModuleLessonsSection moduleId={module.id} />}
          {activeTab === 'quizzes' && <ModuleQuizSection moduleId={module.id} />}
          {activeTab === 'homework' && <ModuleHomeworkSection moduleId={module.id} students={students} />}
          {activeTab === 'sequences' && <ModuleSequencesSection moduleId={module.id} students={students} />}
        </div>
    </div>
  );
}
