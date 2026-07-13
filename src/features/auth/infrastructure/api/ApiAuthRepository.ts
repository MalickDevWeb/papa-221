import type { AuthRepository } from '../../domain/port/AuthRepository';
import type { Utilisateur } from '../../domain/model/Utilisateur';
import { IdentifiantsInvalidesError } from '../../domain/exception/AuthExceptions';
import type { AxiosInstance } from 'axios';

export class ApiAuthRepository implements AuthRepository {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async login(email: string, motDePasse: string): Promise<{ utilisateur: Utilisateur; token: string }> {
    try {
      const { data } = await this.http.post('/auth/login', { email, password: motDePasse });
      return {
        utilisateur: {
          id: data.user.id,
          nom: data.user.nom,
          prenom: data.user.prenom,
          email: data.user.email,
          role: data.user.role,
        },
        token: data.token,
      };
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 404) {
        throw new IdentifiantsInvalidesError();
      }
      throw error;
    }
  }
}
