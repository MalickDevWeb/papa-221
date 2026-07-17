import { Homework } from '../domain/Homework';
import { HomeworkRepository } from '../domain/HomeworkRepository';

export function createGetHomeworksUseCase(repository: HomeworkRepository) {
  return async function execute(): Promise<Homework[]> {
    return await repository.getHomeworks();
  };
}
