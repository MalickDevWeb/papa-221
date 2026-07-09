import { useState, useEffect, useCallback } from 'react';

export function useModuleExercises(moduleId: string) {
  const [exercises, setExercises] = useState<any[]>([]);

  const loadExercises = useCallback(() => {
    const stored = localStorage.getItem('mon_ecole_module_exercises');
    if (stored) {
      setExercises(JSON.parse(stored).filter((e: any) => e.moduleId === moduleId));
    }
  }, [moduleId]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const addExercise = (exe: any) => {
    const stored = localStorage.getItem('mon_ecole_module_exercises');
    const all = stored ? JSON.parse(stored) : [];
    all.push({ id: `exe-${Date.now()}`, moduleId, completedStudentIds: [], ...exe });
    localStorage.setItem('mon_ecole_module_exercises', JSON.stringify(all));
    loadExercises();
  };

  const deleteExercise = (id: string) => {
    const stored = localStorage.getItem('mon_ecole_module_exercises');
    if (stored) {
      localStorage.setItem('mon_ecole_module_exercises', JSON.stringify(JSON.parse(stored).filter((e: any) => e.id !== id)));
      loadExercises();
    }
  };

  const toggleStudentComplete = (exerciseId: string, studentId: string) => {
    const stored = localStorage.getItem('mon_ecole_module_exercises');
    if (stored) {
      const updated = JSON.parse(stored).map((e: any) => {
        if (e.id === exerciseId) {
          const completed = e.completedStudentIds || [];
          const completedStudentIds = completed.includes(studentId)
            ? completed.filter((id: string) => id !== studentId)
            : [...completed, studentId];
          return { ...e, completedStudentIds };
        }
        return e;
      });
      localStorage.setItem('mon_ecole_module_exercises', JSON.stringify(updated));
      loadExercises();
    }
  };

  return {
    exercises,
    addExercise,
    deleteExercise,
    toggleStudentComplete,
  };
}
