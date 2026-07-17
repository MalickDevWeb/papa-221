export interface VigilProfile {
  id: string;
  nom: string;
  prenom: string;
  badgeId: string;
  equipe: string;
  derniereConnexion: string;
  statut: 'Opérationnel' | 'En pause' | 'Hors service';
}
