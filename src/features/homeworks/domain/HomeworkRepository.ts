import { Homework } from './Homework';

export interface HomeworkRepository {
  getHomeworks(): Promise<Homework[]>;
  saveHomework(homework: Homework): Promise<void>;
  startHomework(homeworkId: string): Promise<void>;
  advanceHomeworkProgress(homeworkId: string, addedProgress: number): Promise<void>;
  submitHomework(homeworkId: string, fileData: File | Blob): Promise<void>;
}
