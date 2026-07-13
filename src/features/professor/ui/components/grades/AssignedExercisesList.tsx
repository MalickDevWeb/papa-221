import React from 'react';
import { Trash2, Calendar } from 'lucide-react';

interface Exercise {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly priority: 'haute' | 'normale';
  readonly dueDate: string;
}

interface Props {
  readonly exercises: readonly Exercise[];
  readonly onDelete: (id: string) => void;
}

export function AssignedExercisesList({ exercises, onDelete }: Props) {
  if (exercises.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-xs font-bold text-neutral-400">
        Aucun travail personnalisé assigné.
      </div>
    );
  }

  return (
    <div className="space-y-2.5 max-h-[350px] overflow-y-auto no-scrollbar">
      {exercises.map((ex) => (
        <div
          key={ex.id}
          className="p-4 bg-[#FAF9F6] hover:bg-white border border-neutral-100 rounded-2xl hover:shadow-xs transition-all flex justify-between gap-3 items-start"
        >
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-1.5">
              <h5 className="text-xs font-black text-neutral-800">{ex.title}</h5>
              {ex.priority === 'haute' && (
                <span className="bg-[#FFF5F5] border border-brand-red-deep/15 text-brand-red-deep text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                  Urgent
                </span>
              )}
            </div>
            {ex.description && (
              <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">{ex.description}</p>
            )}
            <span className="text-[9px] text-neutral-400 font-bold flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Limite : {ex.dueDate}
            </span>
          </div>
          <button
            onClick={() => onDelete(ex.id)}
            className="text-neutral-300 hover:text-brand-red-deep p-1.5 rounded-lg hover:bg-[#FFF5F5] border-0 bg-transparent cursor-pointer transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
