import { ApiAdminRepository } from '../api/ApiAdminRepository';
import { InMemoryAdminRepository } from '../local/InMemoryAdminRepository';
import { ManageAdminUseCase } from '../../usecases/ManageAdminUseCase';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const adminRepository = useMock
  ? new InMemoryAdminRepository()
  : new ApiAdminRepository();

export const manageAdminUseCase = new ManageAdminUseCase(adminRepository);
