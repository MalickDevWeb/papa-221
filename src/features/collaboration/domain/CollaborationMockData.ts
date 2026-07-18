import { GroupMember, VirtualClass, AdminMeeting, Workgroup, CollabMessage, RepoDocument, CollabTask, GroupHomework } from './CollaborationModels';

export const COLLAB_STUDENTS_MOCK: readonly GroupMember[] = [
  { id: 'stud-1', name: 'Amadou Diop', email: 'amadou.diop@ecole221.sn', gpa: 3.8, gender: 'M' },
  { id: 'stud-2', name: 'Fatou Sow', email: 'fatou.sow@ecole221.sn', gpa: 3.9, gender: 'F' },
  { id: 'stud-3', name: 'Ousmane Sy', email: 'ousmane.sy@ecole221.sn', gpa: 2.7, gender: 'M' },
  { id: 'stud-4', name: 'Aissatou Diallo', email: 'aissatou.diallo@ecole221.sn', gpa: 3.5, gender: 'F' },
  { id: 'stud-5', name: 'Cheikh Ndiaye', email: 'cheikh.ndiaye@ecole221.sn', gpa: 3.1, gender: 'M' },
  { id: 'stud-6', name: 'Mariama Ba', email: 'mariama.ba@ecole221.sn', gpa: 3.6, gender: 'F' },
  { id: 'stud-7', name: 'Boubacar Cisse', email: 'boubacar.cisse@ecole221.sn', gpa: 2.9, gender: 'M' },
  { id: 'stud-8', name: 'Khadija Gueye', email: 'khadija.gueye@ecole221.sn', gpa: 3.4, gender: 'F' },
];

export const INITIAL_MEETS: readonly VirtualClass[] = [
  {
    id: 'meet-1',
    classIds: ['L3-INFO'],
    classNames: ['L3 Informatique'],
    subjectName: 'Génie Logiciel',
    teacherName: 'Dr. Ndiaye',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    isPublished: true,
    date: 'Lundi 20 Juillet',
    time: '10h - 12h',
    restrictToGoogleAccount: true,
  },
];

export const INITIAL_ADMIN_MEETS: readonly AdminMeeting[] = [
  {
    id: 'admin-meet-1',
    title: 'Cérémonie d\'Accueil & Orientation 2026',
    organizer: 'Administration Générale',
    targetScope: 'ALL',
    targetDetails: 'Tous les étudiants',
    type: 'cérémonie',
    meetLink: 'https://meet.google.com/xyz-work-shp',
    date: 'Vendredi 24 Juillet',
    time: '09h - 11h',
  },
];

export const INITIAL_WORKGROUPS: readonly Workgroup[] = [
  {
    id: 'group-1',
    name: 'Groupe Alpha - Intelligence Artificielle',
    description: 'Recherche et développement sur le Deep Learning appliqué à la santé.',
    creationDate: '17/07/2026',
    leaderId: 'stud-2',
    leaderName: 'Fatou Sow',
    members: [
      { id: 'stud-1', name: 'Amadou Diop', email: 'amadou.diop@ecole221.sn', gpa: 3.8, gender: 'M' },
      { id: 'stud-2', name: 'Fatou Sow', email: 'fatou.sow@ecole221.sn', gpa: 3.9, gender: 'F' },
    ],
    projects: ['Classification d\'imagerie médicale'],
    classId: 'M1-IA',
  },
];

export const INITIAL_MESSAGES: readonly CollabMessage[] = [
  {
    id: 'm-1',
    groupId: 'group-1',
    senderName: 'Fatou Sow',
    senderRole: 'ETUDIANT',
    text: 'Bonjour à tous ! J\'ai téléversé les diapositives de notre projet.',
    fileType: 'presentation',
    fileName: 'Rapport_Projet_IA_Sante.pptx',
    timestamp: '09:42',
  },
];

export const INITIAL_DOCUMENTS: readonly RepoDocument[] = [
  {
    id: 'doc-1',
    groupId: 'group-1',
    name: 'Rapport Final de Spécifications',
    description: 'Cahier des charges et architecture logicielle pour l\'analyseur d\'imagerie médicale.',
    latestVersion: 2,
    updatedBy: 'Amadou Diop',
    updatedAt: '17/07/2026 10:15',
    history: [
      { version: 1, author: 'Fatou Sow', fileUrl: '#', updatedAt: '16/07/2026 14:00', comment: 'Initialisation du cahier des charges' },
      { version: 2, author: 'Amadou Diop', fileUrl: '#', updatedAt: '17/07/2026 10:15', comment: 'Mise à jour des diagrammes de cas d\'utilisation' },
    ],
    status: 'En attente',
    comments: [
      { id: 'dc-1', author: 'Dr. Ndiaye', text: 'Excellent début de structure, n\'oubliez pas de détailler l\'analyse de performances.', timestamp: '17/07/2026 11:30' },
    ],
  },
];

export const INITIAL_TASKS: readonly CollabTask[] = [
  {
    id: 'task-1',
    groupId: 'group-1',
    title: 'Nettoyage du jeu de données d\'images',
    status: 'En cours',
    assignedTo: 'Amadou Diop',
    deadline: '22/07/2026',
    checklist: [
      { id: 'c-1', text: 'Retirer les images floues', done: true },
      { id: 'c-2', text: 'Normaliser la taille en 224x224', done: false },
    ],
  },
];

export const INITIAL_HOMEWORKS: readonly GroupHomework[] = [
  {
    id: 'g-hw-1',
    title: 'Livrable Architecture & Spécifications',
    description: 'Soumettez le cahier des charges et diagrammes UML de votre solution.',
    deadline: '25/07/2026',
    targetGroups: ['group-1'],
    submissions: [],
  },
];
