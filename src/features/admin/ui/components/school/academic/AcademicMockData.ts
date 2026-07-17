export interface AcademicYear {
  id: string;
  name: string;
  status: 'actif' | 'archive';
}

export interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AcademicModule {
  id: string;
  code: string;
  title: string;
  credits: number;
  minGrade: number; // Validation rule: minimum score /20
  competencies: string[];
  teacherId: string;
  roomId: string;
}

export interface ExamPeriod {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

export const INITIAL_YEARS: AcademicYear[] = [
  { id: '1', name: 'Année Académique 2025-2026', status: 'archive' },
  { id: '2', name: 'Année Académique 2026-2027', status: 'actif' }
];

export const INITIAL_SESSIONS: Session[] = [
  { id: 's1', name: 'Semestre 1 (Session Automne)', startDate: '2026-09-01', endDate: '2027-01-15' },
  { id: 's2', name: 'Semestre 2 (Session Printemps)', startDate: '2027-02-01', endDate: '2027-06-30' }
];

export const INITIAL_PROMOTIONS = [
  { id: 'p1', name: 'Promotion 2026 (Licence Génie Logiciel)' },
  { id: 'p2', name: 'Promotion 2027 (Master EdTech & AI)' }
];

export const INITIAL_MODULES: AcademicModule[] = [
  {
    id: 'm1',
    code: 'RDM-301',
    title: 'Résistance des Matériaux (RDM)',
    credits: 6,
    minGrade: 12,
    competencies: ['Dimensionner une structure', 'Calculer les contraintes', 'Modéliser en 3D'],
    teacherId: 't1',
    roomId: '101'
  },
  {
    id: 'm2',
    code: 'MAT-302',
    title: 'Mathématiques de l’Ingénieur',
    credits: 5,
    minGrade: 10,
    competencies: ['Résolution d’équations différentielles', 'Calcul matriciel complexe'],
    teacherId: 't2',
    roomId: '102'
  }
];

export const INITIAL_EXAMS: ExamPeriod[] = [
  { id: 'e1', title: 'Partiels de Mi-Semestre (S1)', startDate: '2026-11-10', endDate: '2026-11-15' },
  { id: 'e2', title: 'Examens Terminaux Session Normale (S1)', startDate: '2027-01-08', endDate: '2027-01-15' }
];

export const TEACHERS = [
  { id: 't1', name: 'Prof. Malick Ndiaye', specialty: 'Génie Civil & Structure' },
  { id: 't2', name: 'Dr. Astou Sow', specialty: 'Mathématiques Appliquées' },
  { id: 't3', name: 'Prof. Amadou Diop', specialty: 'Intelligence Artificielle & Big Data' }
];
