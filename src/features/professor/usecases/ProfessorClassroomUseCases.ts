import type { ProfessorRepository } from '../domain/ProfessorRepository';
import type { 
  VigilCheckIn,
  ClassroomReminder,
  ProfessorLesson,
  CourseModule,
  CourseQuiz,
  QuizQuestion
} from '../domain/ProfessorModels';

export function createGetVigilCheckInsUseCase(repo: ProfessorRepository) {
  return (): Promise<VigilCheckIn[]> => {
    return repo.getVigilCheckIns();
  };
}

export function createGetRemindersUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<ClassroomReminder[]> => {
    return repo.getReminders(courseId);
  };
}

export function createCreateReminderUseCase(repo: ProfessorRepository) {
  return async (courseId: string, content: string, isUrgent: boolean): Promise<ClassroomReminder> => {
    if (!content.trim()) throw new Error("Le contenu du rappel est requis");
    return repo.createReminder(courseId, content, isUrgent);
  };
}

export function createGetLessonsUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<ProfessorLesson[]> => {
    return repo.getLessons(courseId);
  };
}

export function createCreateLessonUseCase(repo: ProfessorRepository) {
  return async (courseId: string, title: string, description: string, attachmentName?: string, attachmentUrl?: string, moduleId?: string): Promise<ProfessorLesson> => {
    if (!title.trim()) throw new Error("Le titre du cours est requis");
    return repo.createLesson(courseId, title, description, attachmentName, attachmentUrl, moduleId);
  };
}

export function createGetModulesUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<CourseModule[]> => {
    return repo.getModules(courseId);
  };
}

export function createCreateModuleUseCase(repo: ProfessorRepository) {
  return async (courseId: string, title: string, description: string): Promise<CourseModule> => {
    if (!title.trim()) throw new Error("Le titre du module est requis");
    return repo.createModule(courseId, title, description);
  };
}

export function createGetQuizzesUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<CourseQuiz[]> => {
    return repo.getQuizzes(courseId);
  };
}

export function createCreateQuizUseCase(repo: ProfessorRepository) {
  return async (moduleId: string, title: string, description: string, questions: QuizQuestion[]): Promise<CourseQuiz> => {
    if (!title.trim()) throw new Error("Le titre du quiz est requis");
    if (questions.length === 0) throw new Error("Le quiz doit contenir au moins une question");
    return repo.createQuiz(moduleId, title, description, questions);
  };
}
