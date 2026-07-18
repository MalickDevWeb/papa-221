import { LoginUseCase, LoginResult } from '../port/usecase/LoginUseCase';
import { AuthRepositoryPort } from '../../domain/port/AuthRepositoryPort';

export class LoginService implements LoginUseCase {
  constructor(private readonly repository: AuthRepositoryPort) {}

  public async execute(email: string, passwordSecret: string): Promise<LoginResult> {
    if (!email || !passwordSecret) {
      throw new Error('Email et mot de passe requis');
    }

    const authData = await this.repository.findByEmail(email);
    if (!authData) {
      throw new Error('Identifiants de connexion invalides');
    }

    // Direct password matching matching legacy behaviour
    if (authData.passwordHash !== passwordSecret) {
      throw new Error('Identifiants de connexion invalides');
    }

    return {
      user: authData.user,
      token: authData.token
    };
  }
}
