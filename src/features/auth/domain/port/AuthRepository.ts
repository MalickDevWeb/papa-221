import type { Utilisateur } from '../model/Utilisateur';

export interface AuthRepository {
  login(email: string, motDePasse: string): Promise<{ utilisateur: Utilisateur; token: string }>;
}
