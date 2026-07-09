import type { AuthRepository } from '../domain/port/AuthRepository';
import type { LoginCommand } from './LoginCommand';
import type { Utilisateur } from '../domain/model/Utilisateur';

export function createLoginUseCase(repo: AuthRepository) {
  return async function executer(cmd: LoginCommand): Promise<{ utilisateur: Utilisateur; token: string }> {
    return await repo.login(cmd.email, cmd.motDePasse);
  };
}
