import { apiClient } from '@/shared/lib/apiClient';
import { ApiAuthRepository } from '../api/ApiAuthRepository';
import { InMemoryAuthRepository } from '../local/InMemoryAuthRepository';
import { createLoginUseCase } from '../../usecases/createLoginUseCase';

// VITE_USE_MOCK=true  → backend simulé (InMemory) — développement
// VITE_USE_MOCK=false → vrai backend Express sur /api/auth/login — production
const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

const authRepository = useMock
  ? new InMemoryAuthRepository()
  : new ApiAuthRepository(apiClient);

export const loginUseCase = createLoginUseCase(authRepository);
