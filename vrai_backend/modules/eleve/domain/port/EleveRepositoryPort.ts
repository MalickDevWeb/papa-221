import { Eleve } from '../model/Eleve';

export interface EleveRepositoryPort {
  findById(id: string): Promise<Eleve | null>;
  findByMatricule(matricule: string): Promise<Eleve | null>;
  save(eleve: Eleve): Promise<void>;
  findPromotionName(promotionId: string): Promise<{ name: string; filiere: string; faculte: string } | null>;
}
