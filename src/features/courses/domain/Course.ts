export type CourseCategory = 'Informatique & Dév' | 'Management & Business' | 'Soft Skills';
export type CourseEnrollmentStatus = 'en_cours' | 'termine' | 'non_demarre';

export interface Course {
  readonly id: string;
  readonly nom: string;
  readonly description: string;
  readonly categorie: CourseCategory;
  readonly statut: CourseEnrollmentStatus;
  readonly image: string;
  readonly progression: number;
  readonly noteFinale?: string;
  readonly professeur: string;
  readonly salle: string;
  readonly avis?: string;
  readonly volumeHoraire: string;
  readonly prochainCours?: string;
}
