import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import type { Quiz } from '../../../hooks/useModuleQuizzes';

interface Props {
  readonly quizzes: readonly Quiz[];
  readonly activeQuizId: string | null;
  readonly onSelectQuiz: (id: string) => void;
  readonly onAddQuiz: (title: string) => void;
  readonly onDeleteQuiz: (id: string) => void;
}

export function QuizSidebar({
  quizzes,
  activeQuizId,
  onSelectQuiz,
  onAddQuiz,
  onDeleteQuiz,
}: Props) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddQuiz(newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nouveau Quiz..."
          className="flex-grow px-3 py-2 bg-neutral-50 border border-neutral-200 focus:border-brand-red-deep text-xs font-semibold rounded-xl outline-none"
          required
        />
        <button
          type="submit"
          className="p-2 bg-brand-red-deep text-white rounded-xl hover:bg-brand-red-deep/90 cursor-pointer shadow-3xs flex items-center justify-center shrink-0 border-0"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
        {quizzes.length === 0 ? (
          <p className="text-[11px] text-neutral-400 text-center py-6 font-bold border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
            Aucun quiz créé.
          </p>
        ) : (
          quizzes.map((qz) => (
            <div
              key={qz.id}
              onClick={() => onSelectQuiz(qz.id)}
              className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                activeQuizId === qz.id
                  ? 'bg-[#FFF5F5] border-[#B3181C]/20 text-brand-red-deep font-black'
                  : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span className="text-xs truncate max-w-[150px] flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                {qz.title}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteQuiz(qz.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-brand-red-deep p-1 rounded-lg hover:bg-[#FFF5F5] border-0 bg-transparent transition-all cursor-pointer shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
