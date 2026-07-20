import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoleUtilisateur } from '@/shared/constants';

interface AuthState {
  utilisateur: { id: string; nom: string; role: RoleUtilisateur } | null;
  token: string | null;
  estConnecte: boolean;
  connexionReussie: (payload: { utilisateur: { id: string; nom: string; role: RoleUtilisateur }; token: string }) => void;
  deconnexion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      utilisateur: null,
      token: null,
      estConnecte: false,

      connexionReussie: (payload) => set({
        utilisateur: payload.utilisateur,
        token: payload.token,
        estConnecte: true,
      }),
      deconnexion: () => {
        localStorage.removeItem('access_token');
        set({
          utilisateur: null,
          token: null,
          estConnecte: false,
        });
      },
    }),
    {
      name: 'ecole-221-auth-storage',
    }
  )
);
