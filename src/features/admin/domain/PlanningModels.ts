export interface CalendarSlot {
  id: string;
  subject: string;
  prof: string;
  room: string;
  classe: string;
  day: string; // 'Lundi', 'Mardi', etc.
  slot: string; // '08h - 10h', '10h - 12h', etc.
  type: 'matin' | 'soir';
}

export interface UnassignedCourse {
  id: string;
  subject: string;
  prof: string;
  room: string;
  classe: string;
  duration: string;
}

export interface ConflictAlert {
  id: string;
  type: 'Salle' | 'Enseignant' | 'Classe';
  message: string;
  timestamp: string;
  severity: 'high' | 'medium';
}

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
export const SLOTS = ['08h - 10h', '10h - 12h', '14h - 16h', '16h - 18h', '18h - 20h'];

export const INITIAL_UNASSIGNED: UnassignedCourse[] = [
  { id: 'un-1', subject: 'Béton Armé', prof: 'Dr. Diallo', room: 'Salle 1 - Amphi A', classe: 'L2 Génie Civil', duration: '4h' },
  { id: 'un-2', subject: 'Machine Learning', prof: 'Mme. Sow', room: 'Salle 3 - Labo GC', classe: 'Master 1 Spécialité IA', duration: '2h' },
  { id: 'un-3', subject: 'Construction Métallique', prof: 'M. Ndiaye', room: 'Salle 2 - Informatique', classe: 'L3 CM (Construction Métallique)', duration: '2h' },
];

export const INITIAL_SLOTS: CalendarSlot[] = [
  {
    id: 'slot-1',
    subject: 'Résistance des Matériaux',
    prof: 'Dr. Diallo',
    room: 'Salle 1 - Amphi A',
    classe: 'L2 Génie Civil',
    day: 'Lundi',
    slot: '08h - 10h',
    type: 'matin'
  },
  {
    id: 'slot-2',
    subject: 'Algorithmique & Graphes',
    prof: 'Mme. Sow',
    room: 'Salle 2 - Informatique',
    classe: 'Master 1 Spécialité IA',
    day: 'Mardi',
    slot: '10h - 12h',
    type: 'matin'
  }
];

export const INITIAL_CONFLICTS: ConflictAlert[] = [
  {
    id: 'c-1',
    type: 'Salle',
    message: 'Double réservation de la Salle 1 - Amphi A le Lundi de 08h à 10h',
    timestamp: 'Il y a 5 min',
    severity: 'high'
  }
];
