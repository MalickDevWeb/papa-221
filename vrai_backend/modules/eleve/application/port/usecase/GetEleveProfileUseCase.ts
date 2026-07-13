export interface GetEleveProfileUseCase {
  execute(studentId: string): Promise<any>;
}
