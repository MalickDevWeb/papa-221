import { CourseSession } from './Schedule';

export interface ScheduleRepository {
  /**
   * Récupère tout l'emploi du temps de la semaine en cours
   */
  getWeeklySchedule(): Promise<CourseSession[]>;
}
