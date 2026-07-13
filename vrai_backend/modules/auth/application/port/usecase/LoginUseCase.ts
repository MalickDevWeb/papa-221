import { User } from '../../../domain/model/User';

export interface LoginResult {
  readonly user: User;
  readonly token: string;
}

export interface LoginUseCase {
  execute(email: string, passwordSecret: string): Promise<LoginResult>;
}
