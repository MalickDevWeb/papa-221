import { CreateHomeworkCommand, createHomework } from '../domain/Homework';
import { HomeworkRepository } from '../domain/HomeworkRepository';

export function createAddHomeworkUseCase(repository: HomeworkRepository) {
  return async function execute(cmd: CreateHomeworkCommand): Promise<void> {
    const newHomework = createHomework(cmd);
    await repository.saveHomework(newHomework);
  };
}
