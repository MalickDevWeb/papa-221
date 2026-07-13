export type CourseDay = 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
export type CourseType = 'CM' | 'TD' | 'TP';
export type CourseStatus = 'termine' | 'actuel' | 'a_venir';

export interface CourseSession {
  readonly id: string;
  readonly nom: string;
  readonly jour: CourseDay;
  readonly jourComplet: string;
  readonly dateStr: string;
  readonly heureDebut: string;
  readonly heureFin: string;
  readonly heureStr: string;
  readonly type: CourseType;
  readonly salle: string;
  readonly professeur: string;
  readonly description: string;
  readonly status: CourseStatus;
}

/**
 * Filtre pur : Récupère uniquement les cours d'un jour donné
 */
export function filterSessionsByDay(sessions: CourseSession[], day: CourseDay): CourseSession[] {
  return sessions.filter(session => session.jour === day);
}

/**
 * Calcul pur : Détermine si un cours est en cours (actuel) à un instant T (basé sur l'heure locale)
 * Note: Dans un vrai système, on utiliserait des objets Date, ici on simule avec l'heure
 */
export function isSessionActive(session: CourseSession, currentTime: string): boolean {
  // Simplification : currentTime format "HH:MM"
  return currentTime >= session.heureDebut && currentTime <= session.heureFin;
}
