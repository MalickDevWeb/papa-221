export interface ClassroomReminder {
  readonly id: string;
  readonly courseId: string;
  readonly content: string;
  readonly dateStr: string;
  readonly isUrgent: boolean;
  readonly room?: string;
  readonly salle?: string;
}

export interface ProfessorLesson {
  readonly id: string;
  readonly courseId: string;
  readonly moduleId?: string; // Optional parent module/chapter ID
  readonly title: string;
  readonly description: string;
  readonly dateStr: string;
  readonly attachmentName?: string;
  readonly attachmentUrl?: string;
}

export interface CourseModule {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly questionText: string;
  readonly options: string[];
  readonly correctAnswerIndex: number;
}

export interface CourseQuiz {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly description: string;
  readonly questions: QuizQuestion[];
}
