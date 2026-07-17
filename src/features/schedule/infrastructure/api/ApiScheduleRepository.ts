import type { CourseSession } from '../../domain/Schedule';
import type { ScheduleRepository } from '../../domain/ScheduleRepository';

export class ApiScheduleRepository implements ScheduleRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/schedule') {
    this.baseUrl = baseUrl;
  }

  async getWeeklySchedule(): Promise<CourseSession[]> {
    const res = await fetch(this.baseUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    
    if (!res.ok) {
      throw new Error("Erreur de récupération de l'emploi du temps");
    }
    
    return res.json();
  }
}
