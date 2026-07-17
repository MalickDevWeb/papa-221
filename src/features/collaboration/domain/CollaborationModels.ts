export interface VirtualClass {
  readonly id: string;
  readonly classIds: readonly string[];
  readonly classNames: readonly string[];
  readonly subjectName: string;
  readonly teacherName: string;
  readonly meetLink: string;
  readonly isPublished: boolean;
  readonly date: string;
  readonly time: string;
  readonly restrictToGoogleAccount: boolean;
}

export interface AdminMeeting {
  readonly id: string;
  readonly title: string;
  readonly organizer: string;
  readonly targetScope: 'ALL' | 'FACULTY' | 'DEPT' | 'FILIERE' | 'NIVEAU' | 'CLASSES' | 'TEACHERS' | 'ADMINS';
  readonly targetDetails: string;
  readonly type: 'conférence' | 'panel' | 'soutenance' | 'séminaire' | 'réunion générale' | 'cérémonie' | 'journée d\'accueil' | 'webinaire';
  readonly meetLink: string;
  readonly date: string;
  readonly time: string;
}

export interface GroupMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly gpa: number;
  readonly gender: 'M' | 'F';
}

export interface Workgroup {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imageUrl?: string;
  readonly creationDate: string;
  readonly leaderId: string;
  readonly leaderName: string;
  readonly members: readonly GroupMember[];
  readonly projects: readonly string[];
  readonly classId: string;
}

export interface CollabMessage {
  readonly id: string;
  readonly groupId: string;
  readonly senderName: string;
  readonly senderRole: 'ETUDIANT' | 'PROFESSEUR' | 'ADMIN';
  readonly text: string;
  readonly fileType?: 'image' | 'video' | 'voice' | 'zip' | 'pdf' | 'presentation' | 'code' | 'link' | 'none';
  readonly fileUrl?: string;
  readonly fileName?: string;
  readonly timestamp: string;
}

export interface DocHistoryItem {
  readonly version: number;
  readonly author: string;
  readonly fileUrl: string;
  readonly updatedAt: string;
  readonly comment: string;
}

export interface CollabDocComment {
  readonly id: string;
  readonly author: string;
  readonly text: string;
  readonly timestamp: string;
}

export interface RepoDocument {
  readonly id: string;
  readonly groupId: string;
  readonly name: string;
  readonly description: string;
  readonly latestVersion: number;
  readonly updatedBy: string;
  readonly updatedAt: string;
  readonly history: readonly DocHistoryItem[];
  readonly status: 'En attente' | 'Validé' | 'Rejeté';
  readonly comments: readonly CollabDocComment[];
}

export interface CollabTaskChecklistItem {
  readonly id: string;
  readonly text: string;
  readonly done: boolean;
}

export interface CollabTask {
  readonly id: string;
  readonly groupId: string;
  readonly title: string;
  readonly status: 'A faire' | 'En cours' | 'A valider' | 'Terminé';
  readonly assignedTo: string;
  readonly deadline: string;
  readonly checklist: readonly CollabTaskChecklistItem[];
}

export interface HomeworkSubmission {
  readonly groupId: string;
  readonly groupName: string;
  readonly fileUrl: string;
  readonly fileName: string;
  readonly submittedAt: string;
  readonly feedback?: string;
  readonly grade?: number;
}

export interface GroupHomework {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly deadline: string;
  readonly attachmentUrl?: string;
  readonly targetGroups: readonly string[];
  readonly submissions: readonly HomeworkSubmission[];
}

export interface MeetAttendance {
  readonly id: string;
  readonly meetId: string;
  readonly studentName: string;
  readonly emailUsed: string;
  readonly entryTime: string;
  readonly exitTime?: string;
  readonly durationMinutes?: number;
  readonly participationScore: number;
  readonly isAuthorizedAccount: boolean;
}
