import { useCallback } from 'react';
import { 
  updateGradeUseCase,
  createHomeworkUseCase
} from '../infrastructure/config/dependencies';

export function useProfessorWorkMutations(
  selectedCourseId: string,
  setGrades: React.Dispatch<React.SetStateAction<any[]>>,
  setHomeworks: React.Dispatch<React.SetStateAction<any[]>>
) {
  const handleUpdateGrade = useCallback(async (studentId: string, cc: number, examen: number) => {
    if (!selectedCourseId) return;
    try {
      const updated = await updateGradeUseCase(selectedCourseId, studentId, cc, examen);
      setGrades(prev => prev.map(g => g.studentId === studentId ? updated : g));
      return updated;
    } catch (err) {
      const errorMsg = (err as Error).message || "Impossible de mettre à jour la note";
      alert(errorMsg);
      throw err;
    }
  }, [selectedCourseId, setGrades]);

  const handleCreateHomework = useCallback(async (titre: string, desc: string, prio: 'haute' | 'normale', deadlineStr: string) => {
    if (!selectedCourseId) return;
    try {
      const newHw = await createHomeworkUseCase(selectedCourseId, titre, desc, prio, deadlineStr);
      setHomeworks(prev => [...prev, newHw]);
      return newHw;
    } catch (err) {
      const errorMsg = (err as Error).message || "Impossible de créer le devoir";
      alert(errorMsg);
      throw err;
    }
  }, [selectedCourseId, setHomeworks]);

  return {
    handleUpdateGrade,
    handleCreateHomework
  };
}
