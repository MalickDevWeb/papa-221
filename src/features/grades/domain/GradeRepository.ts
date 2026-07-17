import { Grade } from './Grade';

/**
 * Port (Interface) : Contrat que n'importe quelle source de données doit respecter.
 * Pas d'implémentation, juste la définition.
 */
export interface GradeRepository {
  /**
   * Récupère le relevé de notes complet de l'étudiant connecté
   */
  getStudentGrades(): Promise<Grade[]>;
  
  /**
   * (Optionnel) Pour réclamer la correction d'une note
   */
  requestGradeReview(gradeId: string, reason: string): Promise<void>;
}
