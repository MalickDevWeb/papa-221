export interface PromotionTable {
  id: string;
  name: string;
  filiere: string;
  faculte: string;
}

export interface StudentTable {
  id: string;
  name: string;
  matricule: string;
  promotion_id: string;
  average: number;
  gpa: number;
  mood: string;
}

export interface ProfessorTable {
  id: string;
  name: string;
  email: string;
}

export interface CourseTable {
  id: string;
  titre: string;
  coefficient: number;
  progress: number;
  unites: string[];
  professeur_id: string;
  promotion_id: string;
  prochain_cours: string;
}

export interface AttendanceTable {
  id: string;
  student_id: string;
  timestamp: string;
  type: string;
  method: string;
  status: string;
  salle: string;
  location: string;
}

export interface HomeworkTable {
  id: string;
  course_id: string;
  titre: string;
  desc: string;
  prio: string;
  statut: string;
  deadlineStr: string;
  submittedFiles?: string[];
  comments?: string;
  note?: string;
  progress?: number;
}

export interface LiveSessionTable {
  id: string;
  course_id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  attendeesCount: number;
  thumbnail: string;
  hlsUrl: string;
  reactions?: Record<string, number>;
  chatMessages?: Array<{
    id: string;
    user: string;
    text: string;
    timestamp: string;
    isTeacher: boolean;
  }>;
}

export interface DbSchema {
  promotions?: PromotionTable[];
  students?: StudentTable[];
  professors?: ProfessorTable[];
  courses?: CourseTable[];
  attendances?: AttendanceTable[];
  homeworks?: HomeworkTable[];
  liveSessions?: LiveSessionTable[];
}
