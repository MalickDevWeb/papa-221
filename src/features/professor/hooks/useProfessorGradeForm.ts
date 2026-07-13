import { useState, useCallback } from 'react';

interface ProfessorWithGrades {
  handleUpdateGrade: (studentId: string, cc: number, examen: number) => Promise<any>;
}

export function useProfessorGradeForm(professor: ProfessorWithGrades, triggerToast: (msg: string) => void) {
  const [editingGradeStudentId, setEditingGradeStudentId] = useState<string | null>(null);
  const [editCC, setEditCC] = useState<number>(0);
  const [editExam, setEditExam] = useState<number>(0);

  const handleGradeEditStart = useCallback((studentId: string, currentCC: number, currentExam: number) => {
    setEditingGradeStudentId(studentId);
    setEditCC(currentCC);
    setEditExam(currentExam);
  }, []);

  const handleGradeSave = useCallback(async (studentId: string) => {
    try {
      await professor.handleUpdateGrade(studentId, editCC, editExam);
      setEditingGradeStudentId(null);
      triggerToast('Note enregistrée avec succès !');
    } catch (err) {
      triggerToast('Erreur lors de la mise à jour');
      throw err;
    }
  }, [editCC, editExam, professor, triggerToast]);

  return {
    editingGradeStudentId,
    editCC,
    editExam,
    setEditCC,
    setEditExam,
    handleGradeEditStart,
    handleGradeSave,
  };
}
