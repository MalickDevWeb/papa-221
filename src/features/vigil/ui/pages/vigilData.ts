export interface MockStudent {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly status: 'Autorisé' | 'Paiement' | 'Refusé';
  readonly avatar: string | null;
}

export const MOCK_STUDENTS: Record<string, MockStudent> = {
  '221-5092-B': { id: '221-5092-B', name: 'Mamadou Ndiaye', className: 'Master 2 Big Data', status: 'Autorisé', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
  '221-1430-A': { id: '221-1430-A', name: 'Awa Ndiaye', className: 'Licence 2 Com', status: 'Autorisé', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' },
  '221-9988-C': { id: '221-9988-C', name: 'Fatou Sow', className: 'Licence 3 Marketing', status: 'Paiement', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  '221-7711-X': { id: '221-7711-X', name: 'Abdoulaye Diop', className: 'Master 1 Cybersécurité', status: 'Autorisé', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
  '221-8844-M': { id: '221-8844-M', name: 'Moussa Gueye', className: 'Master 2 Big Data', status: 'Autorisé', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80' },
};

export const DEFAULT_LOGS = [
  { id: '1', name: 'Moussa Gueye', studentId: '221-8844-M', status: 'Autorisé', time: '14:23', type: 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: '2', name: 'Fatou Sow', studentId: '221-9988-C', status: 'Paiement', time: '13:45', type: 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: '3', name: 'Abdoulaye Diop', studentId: '221-7711-X', status: 'Autorisé', time: '11:12', type: 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: '4', name: 'Inconnu', studentId: 'Badge non reconnu', status: 'Refusé', time: '17:55', type: 'Scanner', date: 'Hier', avatar: null },
  { id: '5', name: 'Awa Ndiaye', studentId: '221-1430-A', status: 'Autorisé', time: '16:40', type: 'Scanner', date: 'Hier', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' },
];

export const DEFAULT_CHECKPOINTS = [
  { id: 'cp1', name: 'Portail Entrée Principale', status: 'Sécurisé', lastCheck: '08:30', guard: 'Diallo A.' },
  { id: 'cp2', name: 'Bâtiment Administration', status: 'Sécurisé', lastCheck: '09:15', guard: 'Diallo A.' },
  { id: 'cp3', name: 'Bibliothèque & Archives', status: 'En attente', lastCheck: '-', guard: '-' },
  { id: 'cp4', name: 'Laboratoires & Salles GL', status: 'En attente', lastCheck: '-', guard: '-' },
  { id: 'cp5', name: 'Complexe Omnisports', status: 'En attente', lastCheck: '-', guard: '-' },
];
