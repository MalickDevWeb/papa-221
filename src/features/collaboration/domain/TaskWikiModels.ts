export interface WikiPage {
  readonly id: string;
  readonly groupId: string;
  readonly title: string;
  readonly content: string;
  readonly author: string;
  readonly updatedAt: string;
}

export interface CollabNote {
  readonly id: string;
  readonly groupId: string;
  readonly title: string;
  readonly content: string;
  readonly isPrivate: boolean;
  readonly authorId: string;
  readonly authorName: string;
}

export interface AuditLog {
  readonly id: string;
  readonly groupId: string;
  readonly timestamp: string;
  readonly userName: string;
  readonly action: string;
  readonly ipAddress: string;
}

export interface GroupEvaluation {
  readonly id: string;
  readonly groupId: string;
  readonly groupGrade?: number;
  readonly individualGrades: Record<string, number>;
  readonly feedback: string;
  readonly criteria: {
    readonly quality: number;
    readonly collaboration: number;
    readonly commitFrequency: number;
    readonly promptness: number;
  };
  readonly gradedBy: string;
}
