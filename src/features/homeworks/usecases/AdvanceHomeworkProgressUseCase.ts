import { HomeworkRepository } from '../domain/HomeworkRepository';

export function createAdvanceHomeworkProgressUseCase(repository: HomeworkRepository) {
  return async function execute(homeworkId: string, addedProgress: number): Promise<void> {
    if (addedProgress <= 0) throw new Error("La progression doit être positive");
    await repository.advanceHomeworkProgress(homeworkId, addedProgress);
  };
}
