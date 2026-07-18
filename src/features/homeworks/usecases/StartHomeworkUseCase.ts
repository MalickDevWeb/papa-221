import { HomeworkRepository } from '../domain/HomeworkRepository';

export function createStartHomeworkUseCase(repository: HomeworkRepository) {
  return async function execute(homeworkId: string): Promise<void> {
    await repository.startHomework(homeworkId);
  };
}
