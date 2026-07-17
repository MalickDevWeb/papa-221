export interface UpdateEleveMoodUseCase {
  execute(studentId: string, mood: string): Promise<void>;
}
