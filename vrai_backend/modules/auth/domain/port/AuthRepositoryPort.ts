import { User } from '../model/User';

export interface AuthRepositoryPort {
  findByEmail(email: string): Promise<{ user: User; passwordHash: string; token: string } | null>;
}
