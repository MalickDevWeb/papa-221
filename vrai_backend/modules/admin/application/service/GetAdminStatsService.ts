import { GetAdminStatsUseCase } from '../port/usecase/GetAdminStatsUseCase';
import { AdminRepositoryPort } from '../../domain/port/AdminRepositoryPort';

export class GetAdminStatsService implements GetAdminStatsUseCase {
  constructor(private readonly repository: AdminRepositoryPort) {}

  public async execute(): Promise<any> {
    const counts = await this.repository.getCounts();
    return {
      studentsCount: counts.students,
      professorsCount: counts.professors,
      coursesCount: counts.courses,
      classesCount: counts.promotions,
      presentProfessors: "18 / 20",
      salleOccupation: "85%"
    };
  }
}
