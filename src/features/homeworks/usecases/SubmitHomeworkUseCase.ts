import { HomeworkRepository } from '../domain/HomeworkRepository';

export function createSubmitHomeworkUseCase(repository: HomeworkRepository) {
  return async function execute(homeworkId: string, fileData: File | Blob): Promise<void> {
    if (!fileData) throw new Error("Aucun fichier n'a été fourni");
    await repository.submitHomework(homeworkId, fileData);
  };
}
