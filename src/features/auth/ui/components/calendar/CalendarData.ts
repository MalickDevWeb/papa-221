export interface CourseSession {
  id: string;
  nom: string;
  jour: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
  jourNom: string;
  heure: string;
  salle: string;
  professeur: string;
  type: 'CM' | 'TD' | 'TP';
  enCours?: boolean;
  color?: string;
  syllabus?: string;
}

export const DAYS_ORDER: { key: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN'; name: string }[] = [
  { key: 'LUN', name: 'LUNDI' }, { key: 'MAR', name: 'MARDI' },
  { key: 'MER', name: 'MERCREDI' }, { key: 'JEU', name: 'JEUDI' }, { key: 'VEN', name: 'VENDREDI' }
];

export const GROUP_CLASSES: Record<string, { currentWeek: CourseSession[]; nextWeek: CourseSession[] }> = {
  'L3GL': {
    currentWeek: [
      { id: 'c1', nom: "Algorithmique Avancée", jour: 'LUN', jourNom: "Lundi", heure: "08:00 - 10:00", salle: "Amphi A", professeur: "Dr. Aly Diatta", type: 'CM', syllabus: "Graphes..." },
      { id: 'c2', nom: "Projet Web", jour: 'MAR', jourNom: "Mardi", heure: "09:00 - 12:00", salle: "Labo 3", professeur: "M. Malick Teuw", type: 'TP', syllabus: "React..." },
      { id: 'c3', nom: "Machine Learning", jour: 'MER', jourNom: "Mercredi", heure: "12:00 - 14:00", salle: "Visio", professeur: "Dr. Cheikh Anta", type: 'CM', enCours: true, syllabus: "Intro ML..." },
      { id: 'c4', nom: "Systèmes d'Info", jour: 'JEU', jourNom: "Jeudi", heure: "14:00 - 16:00", salle: "Salle 102", professeur: "Mme. Seynabou", type: 'TD', syllabus: "UML..." },
      { id: 'c5', nom: "Anglais Tech", jour: 'VEN', jourNom: "Vendredi", heure: "10:00 - 12:00", salle: "Salle 204", professeur: "Mr. Mitchell", type: 'TD', syllabus: "Communication..." }
    ],
    nextWeek: [
      { id: 'c1_n', nom: "NoSQL", jour: 'LUN', jourNom: "Lundi", heure: "08:00 - 10:00", salle: "Labo 4", professeur: "Dr. Aly", type: 'TD', syllabus: "MongoDB..." },
      { id: 'c2_n', nom: "Projet (Hackathon)", jour: 'MAR', jourNom: "Mardi", heure: "09:00 - 12:00", salle: "Labo 3", professeur: "M. Malick", type: 'TP', syllabus: "Dev..." },
      { id: 'c3_n', nom: "Examen ML", jour: 'MER', jourNom: "Mercredi", heure: "12:00 - 14:00", salle: "Amphi A", professeur: "Dr. Anta", type: 'CM', syllabus: "Eval..." },
      { id: 'c4_n', nom: "UML Avancé", jour: 'JEU', jourNom: "Jeudi", heure: "14:00 - 16:00", salle: "Salle 102", professeur: "Mme. Seynabou", type: 'TD', syllabus: "Design Patterns..." },
      { id: 'c5_n', nom: "Anglais Oral", jour: 'VEN', jourNom: "Vendredi", heure: "10:00 - 12:00", salle: "Salle 204", professeur: "Mr. Mitchell", type: 'TD', syllabus: "Soutenance..." }
    ]
  },
  'L2SR': { currentWeek: [], nextWeek: [] },
  'M1IA': { currentWeek: [], nextWeek: [] }
};
