export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: 'Disponible' | 'Occupée';
}

export interface Filiere {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Classe {
  id: string;
  name: string;
  level: string;
  filiereId: string;
  capacityMax: number;
  price: number;
}

export interface PlanningSlot {
  id: string;
  day: string;
  slot: string;
  classeId: string;
  subject: string;
  prof: string;
  roomName: string;
}

export const INITIAL_ROOMS: Room[] = [
  { id: 'r-1', name: 'Salle 1 - Amphi A', capacity: 120, equipment: ['Projecteur', 'Climatisation'], status: 'Disponible' },
  { id: 'r-2', name: 'Salle 2 - Informatique', capacity: 40, equipment: ['PC Fixes', 'Climatisation'], status: 'Occupée' },
  { id: 'r-3', name: 'Salle 3 - Labo GC', capacity: 30, equipment: ['Maquettes', 'Projecteur'], status: 'Disponible' },
];

export const INITIAL_FILIERES: Filiere[] = [
  { id: 'f-1', name: 'Génie Civil & Construction', code: 'GC', description: 'Étude des structures et chantiers' },
  { id: 'f-2', name: 'Technologies de l\'Information', code: 'TI', description: 'Génie logiciel et intelligence artificielle' },
];

export const INITIAL_CLASSES: Classe[] = [
  { id: 'c-1', name: 'L1 Génie Civil', level: 'L1', filiereId: 'f-1', capacityMax: 50, price: 850000 },
  { id: 'c-2', name: 'L3 CM (Construction Métallique)', level: 'L3', filiereId: 'f-1', capacityMax: 40, price: 950000 },
  { id: 'c-3', name: 'Master 1 Spécialité IA', level: 'M1', filiereId: 'f-2', capacityMax: 30, price: 1400000 },
];

export const INITIAL_PLANNING: PlanningSlot[] = [
  { id: 'p-1', day: 'Lundi', slot: '08h - 10h', classeId: 'c-1', subject: 'Résistance des Matériaux', prof: 'Prof Diallo', roomName: 'Salle 1 - Amphi A' },
  { id: 'p-2', day: 'Mardi', slot: '10h - 12h', classeId: 'c-2', subject: 'Charpentes Métalliques', prof: 'Mme Sow', roomName: 'Salle 2 - Informatique' },
];
