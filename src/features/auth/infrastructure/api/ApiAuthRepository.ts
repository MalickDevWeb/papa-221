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
    const checkOfflineCache = () => {
      try {
        const offlineUsers = JSON.parse(localStorage.getItem('ecole-221-offline-users') || '{}');
        const cachedUser = offlineUsers[email.toLowerCase().trim()];
        if (cachedUser && cachedUser.passwordHash === btoa(motDePasse)) {
          return {
            utilisateur: cachedUser.utilisateur,
            token: cachedUser.token,
          };
        }
      } catch (err) {
        console.warn('Erreur lors de la lecture du cache hors-ligne :', err);
      }
      return null;
    };

    // Si on sait qu'on est hors-ligne
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const cached = checkOfflineCache();
      if (cached) return cached;
      throw new Error("Vous êtes hors-ligne et ces identifiants n'ont pas été enregistrés sur cet appareil.");
    }

    try {
      const { data } = await this.http.post('/auth/login', { email, password: motDePasse });
      const result = {
        utilisateur: {
          id: data.user.id,
          nom: data.user.nom,
          prenom: data.user.prenom,
          email: data.user.email,
          role: data.user.role,
        },
        token: data.token,
      };

      // Enregistrer pour l'accès hors-ligne futur
      try {
        const offlineUsers = JSON.parse(localStorage.getItem('ecole-221-offline-users') || '{}');
        offlineUsers[email.toLowerCase().trim()] = {
          utilisateur: result.utilisateur,
          token: result.token,
          passwordHash: btoa(motDePasse), // Encodage de base pour comparaison locale
        };
        localStorage.setItem('ecole-221-offline-users', JSON.stringify(offlineUsers));
      } catch (err) {
        console.warn("Impossible d'enregistrer les identifiants pour le mode hors-ligne :", err);
      }

      return result;
    } catch (error) {
      // Si la requête échoue à cause d'un problème réseau, tenter d'utiliser le cache hors-ligne
      const axiosError = error as { response?: { status?: number }; code?: string; message?: string };
      const isNetworkError = !axiosError.response || 
                             axiosError.code === 'ERR_NETWORK' || 
                             axiosError.message?.includes('Network Error');

      if (isNetworkError) {
        const cached = checkOfflineCache();
        if (cached) return cached;
      }

      if (axiosError.response?.status === 401 || axiosError.response?.status === 404) {
        throw new IdentifiantsInvalidesError();
      }
      throw error;
    }
  }
}
