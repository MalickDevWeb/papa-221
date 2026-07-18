import { Grade } from '../domain/Grade';
import { GradeRepository } from '../domain/GradeRepository';

/**
 * Cas d'utilisation : Consulter son bulletin de notes.
 * Orchestre l'appel au repository. Ne sait pas s'il s'agit d'un mock ou d'une API.
 */
export function createGetStudentGradesUseCase(gradeRepository: GradeRepository) {
  return async function execute(): Promise<Grade[]> {
    // 1. Récupérer les notes depuis l'infrastructure (API ou Mock)
    const grades = await gradeRepository.getStudentGrades();
    
    // 2. On pourrait ajouter d'autres règles métiers ici si nécessaire,
    // comme trier par module, ou filtrer celles non publiées.
    
    return grades;
  };
}
