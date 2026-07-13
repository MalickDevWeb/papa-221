import React, { useState } from 'react';
import { X, BookOpen, Settings, FileText, HelpCircle, Clipboard } from 'lucide-react';
import { ModuleGeneralSection } from './ModuleGeneralSection';
import { ModuleLessonsSection } from './ModuleLessonsSection';
import { ModuleQuizSection } from './ModuleQuizSection';
import { ModuleHomeworkSection } from './ModuleHomeworkSection';
import type { CourseModule, StudentEnrolled } from '../../../domain/ProfessorModels';

interface Props {
  readonly module: CourseModule & { readonly status?: 'brouillon' | 'publie' };
  readonly students: readonly StudentEnrolled[];
  readonly onClose: () => void;
  readonly onModulesUpdated: () => void;
}

export function ModuleDetailModal({ module, students, onClose, onModulesUpdated }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'lessons' | 'quizzes' | 'homework'>('info');
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
    <div className="fixed inset-0 z-[250] bg-black/65 flex items-center justify-center p-4 backdrop-blur-xs select-none" onClick={onClose}>
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh] animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-brand-red-deep to-[#291715] px-6 py-4.5 text-white flex justify-between items-center shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 animate-pulse" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/80">E-Learning & Module</span>
              <h3 className="text-sm font-black tracking-tight mt-0.5">{module.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer border-0 bg-transparent transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="bg-neutral-50 px-6 py-2.5 border-b border-neutral-200/60 flex flex-wrap gap-2 shrink-0">
          {[
            { id: 'info', label: 'Infos & Exercices', icon: Settings },
            { id: 'lessons', label: 'Chapitres & Leçons', icon: FileText },
            { id: 'quizzes', label: 'Quiz & QCM', icon: HelpCircle },
            { id: 'homework', label: 'Devoirs & Notes', icon: Clipboard },
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
        </div>
      </div>
    </div>
  );
}
