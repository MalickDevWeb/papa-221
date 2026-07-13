import { UpdateEleveMoodUseCase } from '../port/usecase/UpdateEleveMoodUseCase';
import { EleveRepositoryPort } from '../../../domain/port/EleveRepositoryPort';

export class UpdateEleveMoodService implements UpdateEleveMoodUseCase {
  constructor(private readonly repository: EleveRepositoryPort) {}

  public async execute(studentId: string, mood: string): Promise<void> {
    const eleve = await this.repository.findById(studentId);
    if (!eleve) {
      throw new Error(`Élève avec l'ID ${studentId} introuvable`);
    }

    eleve.updateMood(mood);
    await this.repository.save(eleve);
  }
}
