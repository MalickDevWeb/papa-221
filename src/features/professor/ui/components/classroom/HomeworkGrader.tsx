import React, { useState } from 'react';
import { Save } from 'lucide-react';
import type { StudentEnrolled } from '../../../domain/ProfessorModels';
import type { Homework, HomeworkGrade } from '../../../hooks/useModuleHomework';

interface Props {
  readonly homework: Homework | null;
  readonly students: readonly StudentEnrolled[];
  readonly grades: readonly HomeworkGrade[];
  readonly onSaveGrade: (studentId: string, grade: number | '', feedback: string) => void;
}

export function HomeworkGrader({ homework, students, grades, onSaveGrade }: Props) {
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [gradeVal, setGradeVal] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');

  const startEdit = (studentId: string) => {
    const existing = grades.find((g) => g.homeworkId === homework?.id && g.studentId === studentId);
    setEditingStudentId(studentId);
    setGradeVal(existing ? existing.grade : '');
    setFeedback(existing ? existing.feedback : '');
  };

  if (!homework) {
    return (
      <div className="h-full flex items-center justify-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-xs font-bold text-neutral-400">
        Sélectionnez ou créez une évaluation pour saisir les notes des élèves.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-150 relative">
        <span className="absolute top-4 right-4 bg-white px-2 py-0.5 rounded-lg border border-neutral-150 text-[9px] font-black uppercase text-brand-red-deep">
          {homework.workType || 'devoir'}
        </span>
        <span className="text-[9px] font-black uppercase text-brand-red-deep">Consignes d'Évaluation</span>
        <h4 className="text-sm font-black text-[#291715]">{homework.title}</h4>
        {homework.description && <p className="text-xs text-neutral-500 font-semibold mt-1">{homework.description}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[10px] font-bold text-neutral-400">
          <span>Barème: / {homework.maxPoints} pts</span>
          <span>Date limite: {homework.dueDate}</span>
          <span className="text-brand-red-deep uppercase">Format de rendu respecté: {homework.allowedFormat || 'pdf'}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
        {students.map((student) => {
          const matched = grades.find((g) => g.homeworkId === homework.id && g.studentId === student.id);
          const isEditing = editingStudentId === student.id;
          return (
            <div key={student.id} className="p-2.5 bg-white border border-neutral-150 rounded-xl space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h5 className="text-xs font-black text-neutral-800 truncate">{student.prenom} {student.nom}</h5>
                  {matched && !isEditing && <p className="text-[10px] text-neutral-400 font-semibold italic truncate max-w-[350px]">&ldquo;{matched.feedback}&rdquo;</p>}
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-black text-neutral-800">{matched && matched.grade !== '' ? `${matched.grade}` : '--'}<span className="text-[10px] text-neutral-400 font-bold">/{homework.maxPoints}</span></span>
                  {!isEditing ? (
                    <button onClick={() => startEdit(student.id)} className="px-2 py-1 text-[10px] font-black uppercase text-brand-red-deep bg-[#FFF5F5] hover:bg-brand-red-deep hover:text-white rounded-lg cursor-pointer border-0 transition-colors">Noter</button>
                  ) : <span className="text-[10px] font-bold text-neutral-400">Édition...</span>}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 border-t border-neutral-100 pt-2">
                  <input type="number" max={homework.maxPoints} min={0} value={gradeVal} onChange={(e) => setGradeVal(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Note" className="w-16 px-2 py-1 bg-neutral-50 border border-neutral-200 text-xs font-bold rounded-lg outline-none" />
                  <input type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Commentaire..." className="flex-1 px-2.5 py-1 bg-neutral-50 border border-neutral-200 text-xs font-semibold rounded-lg outline-none" />
                  <button onClick={() => { onSaveGrade(student.id, gradeVal, feedback); setEditingStudentId(null); }} className="bg-brand-red-deep hover:bg-brand-red-deep/90 text-white rounded-lg flex items-center justify-center px-3 py-1 cursor-pointer border-0">
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
