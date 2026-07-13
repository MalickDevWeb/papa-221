export interface DbProfile {
  readonly id: string;
  readonly name: string;
  readonly matricule: string;
  readonly promotion: string;
  readonly gpa: string;
}

export interface Attendance {
  readonly id: string;
  readonly timestamp: string;
  readonly type: string;
  readonly method: string;
  readonly status: string;
  readonly salle: string;
  readonly location: string;
}

export interface ChatMessage {
  readonly id: string;
  readonly user: string;
  readonly text: string;
  readonly timestamp: string;
  readonly isTeacher: boolean;
}

export interface LiveSession {
  readonly id: string;
  readonly courseName: string;
  readonly teacherName: string;
  readonly title: string;
  readonly status: string;
  readonly attendeesCount: number;
  readonly reactions: Record<string, number>;
  readonly chatMessages: ChatMessage[];
}

export interface DashboardData {
  readonly profile: DbProfile;
  readonly attendances: Attendance[];
  readonly liveSessions: LiveSession[];
}
