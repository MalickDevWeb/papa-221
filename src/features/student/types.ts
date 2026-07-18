export interface CoursItem {
  id: string;
  jour: string; 
  nom: string;
  heure: string;
  salle: string;
  professeur: string;
  description: string;
  type: 'CM' | 'TP' | 'TD';
  enCours?: boolean;
}

export interface DbProfile {
  id: string;
  name: string;
  matricule: string;
  promotion: string;
  gpa: string;
}

export interface Attendance {
  id: string;
  timestamp: string;
  type: string;
  method: string;
  status: string;
  salle: string;
  location: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isTeacher: boolean;
}

export interface LiveSession {
  id: string;
  courseName: string;
  teacherName: string;
  title: string;
  status: string;
  attendeesCount: number;
  reactions: Record<string, number>;
  chatMessages: ChatMessage[];
}
