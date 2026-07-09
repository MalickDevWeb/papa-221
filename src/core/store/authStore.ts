import { create } from 'zustand';
import type { RoleUtilisateur } from '@/shared/constants';

interface AuthState {
  utilisateur: { id: string; nom: string; role: RoleUtilisateur } | null;
  token: string | null;
  estConnecte: boolean;
  connexionReussie: (payload: { utilisateur: { id: string; nom: string; role: RoleUtilisateur }; token: string }) => void;
  deconnexion: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Pour tester facilement, on mock un admin connecté au démarrage si on veut
  // utilisateur: { id: 'usr-001', nom: 'Admin', role: 'ADMIN' },
  // token: 'mock-token',
  // estConnecte: true,
  utilisateur: null,
  token: null,
  estConnecte: false,

  connexionReussie: (payload) => set({
    utilisateur: payload.utilisateur,
    token: payload.token,
    estConnecte: true,
  }),
  deconnexion: () => set({
    utilisateur: null,
    token: null,
    estConnecte: false,
  }),
}));
