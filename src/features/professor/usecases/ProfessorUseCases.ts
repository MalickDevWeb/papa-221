import type { ProfessorRepository } from '../domain/ProfessorRepository';
import type { 
  ProfessorCourse, 
  StudentEnrolled, 
  StudentGrade, 
  ProfessorHomework, 
  ProfessorSchedule, 
  VigilCheckIn,
  ClassroomReminder,
  ProfessorLesson,
  CourseModule,
  CourseQuiz,
  QuizQuestion
} from '../domain/ProfessorModels';

export function createGetCoursesUseCase(repo: ProfessorRepository) {
  return (profId: string): Promise<ProfessorCourse[]> => {
    return repo.getCourses(profId);
  };
}

export function createGetStudentsUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<StudentEnrolled[]> => {
    return repo.getStudents(courseId);
  };
}

export function createGetGradesUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<StudentGrade[]> => {
    return repo.getGrades(courseId);
  };
}

export function createUpdateGradeUseCase(repo: ProfessorRepository) {
  return async (courseId: string, studentId: string, cc: number, examen: number): Promise<StudentGrade> => {
    // Validation des notes de l'École 221
    if (cc < 0 || cc > 20) throw new Error("La note CC doit être comprise entre 0 et 20");
    if (examen < 0 || examen > 20) throw new Error("La note d'examen doit être comprise entre 0 et 20");
    
    return repo.updateGrade(courseId, studentId, cc, examen);
  };
}

export function createGetHomeworksUseCase(repo: ProfessorRepository) {
  return (courseId: string): Promise<ProfessorHomework[]> => {
    return repo.getHomeworks(courseId);
  };
}

export function createCreateHomeworkUseCase(repo: ProfessorRepository) {
  return async (
    courseId: string, 
    titre: string, 
    desc: string, 
    prio: 'haute' | 'normale', 
    deadlineStr: string
  ): Promise<ProfessorHomework> => {
    if (!titre.trim()) throw new Error("Le titre du devoir est requis");
    if (!desc.trim()) throw new Error("La description du devoir est requise");
    if (!deadlineStr.trim()) throw new Error("La date limite est requise");
    
    return repo.createHomework(courseId, titre, desc, prio, deadlineStr);
  };
}

export function createGetScheduleUseCase(repo: ProfessorRepository) {
  return (profId: string): Promise<ProfessorSchedule[]> => {
    return repo.getSchedule(profId);
  };
}

export function createCancelCourseUseCase(repo: ProfessorRepository) {
  return (sessionId: string, reason: string): Promise<void> => {
    return repo.cancelCourse(sessionId, reason);
  };
}

export function createRescheduleCourseUseCase(repo: ProfessorRepository) {
  return (sessionId: string, day: string, time: string, room: string): Promise<void> => {
    return repo.rescheduleCourse(sessionId, day, time, room);
  };
}

export * from './ProfessorClassroomUseCases';

