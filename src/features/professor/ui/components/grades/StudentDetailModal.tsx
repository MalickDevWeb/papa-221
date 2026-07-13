import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { ExerciseForm } from './ExerciseForm';
import { AssignedExercisesList } from './AssignedExercisesList';
import type { StudentGrade } from '../../../domain/ProfessorModels';

interface Props {
  readonly studentId: string;
  readonly studentNom: string;
  readonly courseId: string;
  readonly grade: StudentGrade;
  readonly editCC: number;
  readonly editExam: number;
  readonly setEditCC: (value: number) => void;
  readonly setEditExam: (value: number) => void;
  readonly onSave: (studentId: string) => Promise<void>;
  readonly onClose: () => void;
}

export function StudentDetailModal({
  studentId,
  studentNom,
  courseId,
  editCC,
  editExam,
  setEditCC,
  setEditExam,
  onSave,
  onClose,
}: Props) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  const loadExercises = useCallback(() => {
    const stored = localStorage.getItem('mon_ecole_custom_exercises');
    if (stored) {
      const all = JSON.parse(stored);
      setExercises(all.filter((e: any) => e.studentId === studentId && e.courseId === courseId));
    } else {
      setExercises([]);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const handleDeleteExercise = (id: string) => {
    const stored = localStorage.getItem('mon_ecole_custom_exercises');
    if (stored) {
      const all = JSON.parse(stored);
      const updated = all.filter((e: any) => e.id !== id);
      localStorage.setItem('mon_ecole_custom_exercises', JSON.stringify(updated));
      loadExercises();
    }
  };

  const handleSaveGrades = async () => {
    setIsSavingGrade(true);
    await onSave(studentId);
    setTimeout(() => setIsSavingGrade(false), 800);
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/65 flex items-center justify-center p-4 backdrop-blur-xs select-none" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh] animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-brand-red-deep to-[#291715] px-6 py-5 text-white flex justify-between items-center shrink-0">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Fiche de l'étudiant</span>
            <h3 className="text-lg font-black tracking-tight mt-0.5">{studentNom}</h3>
            <p className="text-xs text-white/70 font-semibold mt-0.5 font-mono">Matricule: {studentId.slice(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-full border-0 bg-transparent hover:bg-white/10 cursor-pointer transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100/80 space-y-4">
                <h4 className="text-xs font-black uppercase text-[#291715] tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-brand-red-deep">award</span> Notes d'Évaluation
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400">CC</label>
                    <input type="number" min={0} max={20} step={0.5} value={editCC} onChange={(e) => setEditCC(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#B3181C] text-sm font-black rounded-xl outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400">Examen</label>
                    <input type="number" min={0} max={20} step={0.5} value={editExam} onChange={(e) => setEditExam(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#B3181C] text-sm font-black rounded-xl outline-none" />
                  </div>
                </div>
                <button onClick={handleSaveGrades} className="w-full py-2.5 bg-brand-red-deep text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 hover:bg-brand-red-deep/90 transition-all active:scale-98 cursor-pointer shadow-3xs">
                  {isSavingGrade ? 'Enregistrement...' : 'Enregistrer les notes'}
                </button>
              </div>
              <ExerciseForm studentId={studentId} courseId={courseId} onExerciseAdded={loadExercises} />
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-[#291715] tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-brand-red-deep">assignment_turned_in</span> Travaux assignés ({exercises.length})
              </h4>
              <AssignedExercisesList exercises={exercises} onDelete={handleDeleteExercise} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
