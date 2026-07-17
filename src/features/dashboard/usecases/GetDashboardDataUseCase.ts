import { DashboardData } from '../domain/Dashboard';
import { DashboardRepository } from '../domain/DashboardRepository';

export function createGetDashboardDataUseCase(repository: DashboardRepository) {
  return async function execute(): Promise<DashboardData> {
    return await repository.getDashboardData();
  };
}
