import { CourseSession } from '../domain/Schedule';
import { ScheduleRepository } from '../domain/ScheduleRepository';

export function createGetWeeklyScheduleUseCase(repository: ScheduleRepository) {
  return async function execute(): Promise<CourseSession[]> {
    // Dans un vrai projet, on passerait potentiellement la semaine courante en paramètre
    return await repository.getWeeklySchedule();
  };
}
