export interface Grade {
  readonly id: string;
  readonly module: string;
  readonly prof: string;
  readonly ects: number;
  readonly cc: number;
  readonly examen: number;
  readonly moyPromo: number;
}

/**
 * Calcule la note finale selon le barème de l'École 221
 * Règle métier pure : 40% CC, 60% Examen
 */
export function calculateFinalNote(cc: number, examen: number): number {
  return (cc * 0.4) + (examen * 0.6);
}

/**
 * Calcule le statut de validation de l'UE
 */
export function getModuleStatus(noteFinale: number): 'Validé' | 'Rattrapage' {
  return noteFinale >= 10 ? 'Validé' : 'Rattrapage';
}

/**
 * Calcule la moyenne générale d'un étudiant (Moyenne pondérée par ECTS)
 */
export function calculateMoyenneGenerale(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  
  const totalECTS = grades.reduce((sum, g) => sum + g.ects, 0);
  if (totalECTS === 0) return 0;

  const weightedSum = grades.reduce((sum, g) => sum + (calculateFinalNote(g.cc, g.examen) * g.ects), 0);
  return weightedSum / totalECTS;
}
