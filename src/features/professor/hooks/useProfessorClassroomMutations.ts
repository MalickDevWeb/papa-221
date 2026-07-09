import { useCallback } from 'react';
import { 
  createReminderUseCase,
  createLessonUseCase,
  createModuleUseCase,
  createQuizUseCase
} from '../infrastructure/config/dependencies';
import type { QuizQuestion } from '../domain/ProfessorModels';

export function useProfessorClassroomMutations(
  selectedCourseId: string,
  setReminders: React.Dispatch<React.SetStateAction<any[]>>,
  setLessons: React.Dispatch<React.SetStateAction<any[]>>,
  setModules: React.Dispatch<React.SetStateAction<any[]>>,
  setQuizzes: React.Dispatch<React.SetStateAction<any[]>>
) {
  const handleCreateReminder = useCallback(async (content: string, isUrgent: boolean) => {
    if (!selectedCourseId) return;
    try {
      const newRem = await createReminderUseCase(selectedCourseId, content, isUrgent);
      setReminders(prev => [newRem, ...prev]);
      return newRem;
    } catch (err) {
      const errorMsg = (err as Error).message || "Impossible de créer le rappel";
      alert(errorMsg);
      throw err;
    }
  }, [selectedCourseId, setReminders]);

  const handleCreateLesson = useCallback(async (title: string, description: string, attachmentName?: string, attachmentUrl?: string, moduleId?: string) => {
    if (!selectedCourseId) return;
    try {
      const newLesson = await createLessonUseCase(selectedCourseId, title, description, attachmentName, attachmentUrl, moduleId);
      setLessons(prev => [newLesson, ...prev]);
      return newLesson;
    } catch (err) {
      const errorMsg = (err as Error).message || "Impossible de publier le cours";
      alert(errorMsg);
      throw err;
    }
  }, [selectedCourseId, setLessons]);

  const handleCreateModule = useCallback(async (title: string, description: string) => {
    if (!selectedCourseId) return;
    try {
      const newModule = await createModuleUseCase(selectedCourseId, title, description);
      setModules(prev => [...prev, newModule]);
      return newModule;
    } catch (err) {
      const errorMsg = (err as Error).message || "Impossible de créer le module";
      alert(errorMsg);
      throw err;
    }
  }, [selectedCourseId, setModules]);

  const handleCreateQuiz = useCallback(async (moduleId: string, title: string, description: string, questions: QuizQuestion[]) => {
    try {
      const newQuiz = await createQuizUseCase(moduleId, title, description, questions);
      setQuizzes(prev => [...prev, newQuiz]);
      return newQuiz;
    } catch (err) {
      const errorMsg = (err as Error).message || "Impossible de créer le quiz";
      alert(errorMsg);
      throw err;
    }
  }, [setQuizzes]);

  return {
    handleCreateReminder,
    handleCreateLesson,
    handleCreateModule,
    handleCreateQuiz
  };
}
