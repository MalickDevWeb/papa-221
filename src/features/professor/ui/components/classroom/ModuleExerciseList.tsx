import React from 'react';
import { Trash2, Calendar, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import type { StudentEnrolled } from '../../../domain/ProfessorModels';

interface ExerciseItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly dueDate: string;
  readonly assignedStudentIds: readonly string[];
  readonly completedStudentIds?: readonly string[];
}

interface Props {
  readonly exercises: readonly ExerciseItem[];
  readonly students: readonly StudentEnrolled[];
  readonly onDelete: (id: string) => void;
  readonly onToggleStudentComplete: (exerciseId: string, studentId: string) => void;
}

export function ModuleExerciseList({ exercises, students, onDelete, onToggleStudentComplete }: Props) {
  if (exercises.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-[#FAF9F6] text-xs font-bold text-neutral-400">
        Aucun travail ou exercice personnalisé.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar">
      {exercises.map((ex) => {
        const assignedStudents = students.filter((s) =>
          ex.assignedStudentIds.length === 0 || ex.assignedStudentIds.includes(s.id)
        );

        return (
          <div key={ex.id} className="p-4 bg-white border border-neutral-150 rounded-2xl shadow-3xs space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5">
                <h5 className="text-xs font-black text-neutral-800">{ex.title}</h5>
                {ex.description && (
                  <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">{ex.description}</p>
                )}
                <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-bold">
                  <Calendar className="h-3 w-3 text-neutral-300" />
                  <span>Limite : {ex.dueDate}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(ex.id)}
                className="text-neutral-300 hover:text-brand-red-deep p-1.5 rounded-lg hover:bg-[#FFF5F5] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="border-t border-neutral-100 pt-2.5 space-y-1.5">
              <span className="text-[9px] font-black uppercase text-neutral-400 block">
                Suivi des élèves ({assignedStudents.length})
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-[100px] overflow-y-auto no-scrollbar">
                {assignedStudents.map((s) => {
                  const isDone = ex.completedStudentIds?.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onToggleStudentComplete(ex.id, s.id)}
                      className={`flex items-center justify-between p-1.5 rounded-lg border-0 bg-transparent cursor-pointer text-left text-[9.5px] font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
                          : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="truncate">{(s.prenom || '')} {s.nom ? `${s.nom[0]}.` : ''}</span>
                      {isDone ? (
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
