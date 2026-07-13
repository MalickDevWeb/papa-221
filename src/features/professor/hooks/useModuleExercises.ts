import { useState, useEffect, useCallback } from 'react';

export interface ExerciseItem {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly description?: string;
  readonly dueDate: string;
  readonly assignedStudentIds: readonly string[];
  readonly completedStudentIds?: readonly string[];
}

export function useModuleExercises(moduleId: string) {
  const [exercises, setExercises] = useState<readonly ExerciseItem[]>([]);

  const loadData = useCallback(() => {
    const stored = localStorage.getItem('p_exercises');
    const all: any[] = stored ? JSON.parse(stored) : [];
    const filtered = all.filter((ex: any) => ex.moduleId === moduleId);
    setExercises(filtered);
  }, [moduleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addExercise = useCallback((exe: {
    readonly title: string;
    readonly description: string;
    readonly dueDate: string;
    readonly assignedStudentIds: readonly string[];
  }) => {
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}`,
      moduleId,
      title: exe.title,
      description: exe.description,
      dueDate: exe.dueDate,
      assignedStudentIds: exe.assignedStudentIds,
      completedStudentIds: [],
    };
    const stored = localStorage.getItem('p_exercises');
    const all = stored ? JSON.parse(stored) : [];
    all.push(newEx);
    localStorage.setItem('p_exercises', JSON.stringify(all));
    loadData();
  }, [moduleId, loadData]);

  const deleteExercise = useCallback((id: string) => {
    const stored = localStorage.getItem('p_exercises');
    if (stored) {
      const filtered = JSON.parse(stored).filter((ex: any) => ex.id !== id);
      localStorage.setItem('p_exercises', JSON.stringify(filtered));
      loadData();
    }
  }, [loadData]);

  const toggleStudentComplete = useCallback((exerciseId: string, studentId: string) => {
    const stored = localStorage.getItem('p_exercises');
    if (stored) {
      const all = JSON.parse(stored).map((ex: any) => {
        if (ex.id === exerciseId) {
          const completed = ex.completedStudentIds || [];
          const updated = completed.includes(studentId)
            ? completed.filter((id: string) => id !== studentId)
            : [...completed, studentId];
          return { ...ex, completedStudentIds: updated };
        }
        return ex;
      });
      localStorage.setItem('p_exercises', JSON.stringify(all));
      loadData();
    }
  }, [loadData]);

  return {
    exercises,
    addExercise,
    deleteExercise,
    toggleStudentComplete,
  };
}
