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
} from './ProfessorModels';

export interface ProfessorRepository {
  getCourses(profId: string): Promise<ProfessorCourse[]>;
  getStudents(courseId: string): Promise<StudentEnrolled[]>;
  getGrades(courseId: string): Promise<StudentGrade[]>;
  updateGrade(courseId: string, studentId: string, cc: number, examen: number): Promise<StudentGrade>;
  getHomeworks(courseId: string): Promise<ProfessorHomework[]>;
  createHomework(courseId: string, titre: string, desc: string, prio: 'haute' | 'normale', deadlineStr: string): Promise<ProfessorHomework>;
  getSchedule(profId: string): Promise<ProfessorSchedule[]>;
  cancelCourse(sessionId: string, reason: string): Promise<void>;
  rescheduleCourse(sessionId: string, day: string, time: string, room: string): Promise<void>;
  getVigilCheckIns(): Promise<VigilCheckIn[]>;
  getReminders(courseId: string): Promise<ClassroomReminder[]>;
  createReminder(courseId: string, content: string, isUrgent: boolean): Promise<ClassroomReminder>;
  getLessons(courseId: string): Promise<ProfessorLesson[]>;
  createLesson(courseId: string, title: string, description: string, attachmentName?: string, attachmentUrl?: string, moduleId?: string): Promise<ProfessorLesson>;
  getModules(courseId: string): Promise<CourseModule[]>;
  createModule(courseId: string, title: string, description: string): Promise<CourseModule>;
  getQuizzes(courseId: string): Promise<CourseQuiz[]>;
  createQuiz(moduleId: string, title: string, description: string, questions: QuizQuestion[]): Promise<CourseQuiz>;
}
