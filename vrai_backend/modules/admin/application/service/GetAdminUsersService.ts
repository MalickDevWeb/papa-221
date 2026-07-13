import { GetAdminUsersUseCase } from '../port/usecase/GetAdminUsersUseCase';
import { AdminRepositoryPort } from '../../domain/port/AdminRepositoryPort';

export class GetAdminUsersService implements GetAdminUsersUseCase {
  constructor(private readonly repository: AdminRepositoryPort) {}

  public async execute(): Promise<any> {
    return this.repository.getUsers();
  }
}
