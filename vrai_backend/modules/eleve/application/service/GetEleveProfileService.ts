import { GetEleveProfileUseCase } from '../port/usecase/GetEleveProfileUseCase';
import { EleveRepositoryPort } from '../../../domain/port/EleveRepositoryPort';

export class GetEleveProfileService implements GetEleveProfileUseCase {
  constructor(private readonly repository: EleveRepositoryPort) {}

  public async execute(studentId: string): Promise<any> {
    const eleve = await this.repository.findById(studentId);
    if (!eleve) {
      throw new Error(`Élève avec l'ID ${studentId} introuvable`);
    }

    const promo = await this.repository.findPromotionName(eleve.promotionId);

    return {
      name: eleve.name,
      matricule: eleve.matricule,
      promotion: promo?.name || 'Inconnu',
      filiere: promo?.filiere || 'N/A',
      faculte: promo?.faculte || 'N/A',
      average: eleve.average,
      gpa: eleve.gpa,
      mood: eleve.mood || 'neutral'
    };
  }
}
