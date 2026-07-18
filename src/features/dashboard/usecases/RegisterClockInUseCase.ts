import { Attendance } from '../domain/Dashboard';
import { DashboardRepository } from '../domain/DashboardRepository';

export function createRegisterClockInUseCase(repository: DashboardRepository) {
  return async function execute(type: string, method: string): Promise<Attendance> {
    return await repository.registerClockIn(type, method);
  };
}
