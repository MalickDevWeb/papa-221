import type { ProfessorRepository } from '../../domain/ProfessorRepository';
import { notificationRepository } from '@/features/notifications/infrastructure/config/dependencies';
import type { 
  ProfessorCourse, 
  StudentEnrolled, 
  StudentGrade, 
  ProfessorHomework, 
  ProfessorSchedule, 
  VigilCheckIn,
  ClassroomReminder,
  ProfessorLesson,
  CourseModule,
  CourseQuiz,
  QuizQuestion
} from '../../domain/ProfessorModels';

const DEFAULT_MODULES: CourseModule[] = [
  // Course-4 modules
  { id: 'mod-1', courseId: 'course-4', title: 'Module 1 : Cryptographie Symétrique & Fondamentaux', description: 'Concepts théoriques, chiffrement symétrique par blocs, attaques et parades.' },
  { id: 'mod-2', courseId: 'course-4', title: 'Module 2 : Sécurité Réseau & Handshake TLS', description: 'Protocoles SSL/TLS, certificats, chiffrement asymétrique et sécurisation des canaux.' },
  { id: 'mod-3', courseId: 'course-4', title: 'Module 3 : Firewalls, IDS & Contrôle d\'Accès', description: 'Mise en place de pare-feux, détection des intrusions et filtrage réseau.' },

  // Course-1 modules
  { id: 'mod-4', courseId: 'course-1', title: 'Module 1 : Analyse de Complexité & Notations Asymptotiques', description: 'Modélisation du temps d\'exécution, borne supérieure et calcul de complexité.' },
  { id: 'mod-5', courseId: 'course-1', title: 'Module 2 : Algorithmes Diviser pour Régner', description: 'Application au tri rapide, fusion et multiplication matricielle de Strassen.' },
  { id: 'mod-6', courseId: 'course-1', title: 'Module 3 : Programmation Dynamique', description: 'Principe d\'optimalité, mémoisation, problème du sac à dos et alignement de séquences.' },
];

const DEFAULT_QUIZZES: CourseQuiz[] = [
  {
    id: 'quiz-1',
    moduleId: 'mod-1',
    title: 'Quiz 1 : Algorithmes AES & Modes d\'Opération',
    description: 'Vérification de vos connaissances sur les cycles d\'AES et l\'usage des IV dans les différents modes (CBC, GCM).',
    questions: [
      {
        id: 'q1',
        questionText: 'Combien de rounds (cycles) comporte le chiffrement AES-128 ?',
        options: ['10 rounds', '12 rounds', '14 rounds', '16 rounds'],
        correctAnswerIndex: 0
      },
      {
        id: 'q2',
        questionText: 'Quel mode de chiffrement de bloc intègre nativement l\'authentification (AEAD) ?',
        options: ['ECB', 'CBC', 'GCM', 'OFB'],
        correctAnswerIndex: 2
      },
      {
        id: 'q3',
        questionText: 'Pourquoi le mode ECB est-il considéré comme non sécurisé ?',
        options: [
          'Il est trop lent',
          'Il produit le même bloc chiffré pour des blocs de texte en clair identiques',
          'Il nécessite une clé de 1024 bits',
          'Il corrompt facilement les données'
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'quiz-2',
    moduleId: 'mod-4',
    title: 'Quiz d\'évaluation : Complexité & Grand O',
    description: 'Testez votre compréhension de la notation Grand O et de la récurrence.',
    questions: [
      {
        id: 'q4',
        questionText: 'Quelle est la complexité du pire des cas pour la recherche binaire dans un tableau trié ?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswerIndex: 1
      },
      {
        id: 'q5',
        questionText: 'Selon le théorème maître (Master Theorem), si T(N) = 2T(N/2) + O(N), quelle est la complexité ?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
        correctAnswerIndex: 1
      }
    ]
  }
];

const DEFAULT_LESSONS: ProfessorLesson[] = [
  {
    id: 'les-1',
    courseId: 'course-4',
    moduleId: 'mod-1',
    title: "Chapitre 1 : Introduction à la Cryptographie Symétrique",
    description: "Concepts de base de la cryptographie symétrique, algorithme AES, chiffrement par bloc et modes d'opération (CBC, GCM).",
    dateStr: "Publié le 15 Juin 2026",
    attachmentName: "Cours_Crypto_Symetrique.pdf",
    attachmentUrl: "#"
  },
  {
    id: 'les-2',
    courseId: 'course-4',
    moduleId: 'mod-2',
    title: "Chapitre 2 : Protocoles Réseau Sécurisés (TLS/SSL)",
    description: "Analyse détaillée du handshake TLS 1.3, certificats X.509, autorités de certification et sécurité de la couche transport.",
    dateStr: "Publié le 22 Juin 2026",
    attachmentName: "TP_TLS_Handshake_Wireshark.pdf",
    attachmentUrl: "#"
  },
  {
    id: 'les-3',
    courseId: 'course-1',
    moduleId: 'mod-4',
    title: "Chapitre 1 : Complexité Algorithmique et Grand O",
    description: "Définition formelle des notations asymptotiques (O, Omega, Theta), techniques de calcul de complexité temporelle et spatiale.",
    dateStr: "Publié le 10 Juin 2026",
    attachmentName: "Complexite_Cours_1.pdf",
    attachmentUrl: "#"
  }
];

const DEFAULT_REMINDERS: ClassroomReminder[] = [
  {
    id: 'rem-1',
    courseId: 'course-1',
    content: "Rappel : Le projet final sur la programmation dynamique doit être soumis avant lundi matin 8h00.",
    dateStr: "Aujourd'hui à 09:30",
    isUrgent: true
  },
  {
    id: 'rem-2',
    courseId: 'course-4',
    content: "N'oubliez pas d'installer le simulateur de firewall Wireshark avant la séance de TP de mardi.",
    dateStr: "Hier",
    isUrgent: false
  }
];

const MOCK_COURSES_TEACHER_1: ProfessorCourse[] = [
  {
    id: 'course-4',
    titre: "Sécurité des Systèmes d'Information",
    coefficient: 4,
    progress: 10,
    unites: ['Cryptographie', 'Firewalls', 'Conformité'],
    prochainCours: 'Mardi à 13h00',
    salle: 'Amphi B',
    classe: 'L3 Développement Web'
  },
  {
    id: 'course-1',
    titre: 'Algorithmique Avancée & Complexité',
    coefficient: 5,
    progress: 80,
    unites: ['Graphes', 'Programmation Dynamique', 'Complexité'],
    prochainCours: 'Lundi à 08h00',
    salle: 'Amphi A',
    classe: 'L2 CM'
  }
];

const MOCK_COURSES_TEACHER_2: ProfessorCourse[] = [
  {
    id: 'course-5',
    titre: 'Prise de Parole en Public',
    coefficient: 3,
    progress: 100,
    unites: ['Expression Orale', 'Gestion du Trac', 'Pitch commercial'],
    prochainCours: 'Jeudi à 10h00',
    salle: 'Salle Rethorique 1',
    classe: 'L1 Développement Web'
  },
  {
    id: 'course-2',
    titre: 'Management Stratégique II',
    coefficient: 4,
    progress: 40,
    unites: ['Gouvernance', 'Analyse Globale', 'Cas d\'études'],
    prochainCours: 'Mardi à 09h00',
    salle: 'Salle de séminaire C',
    classe: 'Master IA'
  }
];

const MOCK_STUDENTS: StudentEnrolled[] = [
  { id: 'usr-etudiant-01', nom: 'Diop', prenom: 'Assane', email: 'etudiant221@gmail.com', matricule: '221-E001' },
  { id: 'usr-etudiant-02', nom: 'Sow', prenom: 'Fatou', email: 'etudiant222@gmail.com', matricule: '221-E002' },
  { id: 'usr-etudiant-03', nom: 'Ndiaye', prenom: 'Malick', email: 'etudiant223@gmail.com', matricule: '221-E003' },
];

const DEFAULT_GRADES: StudentGrade[] = [
  // Sécurité des Systèmes d'Information
  { id: 'gr-1', studentId: 'usr-etudiant-01', studentNom: 'Assane Diop', courseId: 'course-4', cc: 14, examen: 12, finalGrade: 12.8, status: 'Validé' },
  { id: 'gr-2', studentId: 'usr-etudiant-02', studentNom: 'Fatou Sow', courseId: 'course-4', cc: 11, examen: 9, finalGrade: 9.8, status: 'Rattrapage' },
  { id: 'gr-3', studentId: 'usr-etudiant-03', studentNom: 'Malick Ndiaye', courseId: 'course-4', cc: 16, examen: 15, finalGrade: 15.4, status: 'Validé' },

  // Algorithmique Avancée & Complexité
  { id: 'gr-4', studentId: 'usr-etudiant-01', studentNom: 'Assane Diop', courseId: 'course-1', cc: 15, examen: 16, finalGrade: 15.6, status: 'Validé' },
  { id: 'gr-5', studentId: 'usr-etudiant-02', studentNom: 'Fatou Sow', courseId: 'course-1', cc: 10, examen: 8, finalGrade: 8.8, status: 'Rattrapage' },
  { id: 'gr-6', studentId: 'usr-etudiant-03', studentNom: 'Malick Ndiaye', courseId: 'course-1', cc: 18, examen: 17, finalGrade: 17.4, status: 'Validé' },

  // Prise de Parole en Public
  { id: 'gr-7', studentId: 'usr-etudiant-01', studentNom: 'Assane Diop', courseId: 'course-5', cc: 18, examen: 19, finalGrade: 18.6, status: 'Validé' },
  { id: 'gr-8', studentId: 'usr-etudiant-02', studentNom: 'Fatou Sow', courseId: 'course-5', cc: 14, examen: 15, finalGrade: 14.6, status: 'Validé' },
  { id: 'gr-9', studentId: 'usr-etudiant-03', studentNom: 'Malick Ndiaye', courseId: 'course-5', cc: 12, examen: 11, finalGrade: 11.4, status: 'Validé' },
];

const DEFAULT_HOMEWORKS: ProfessorHomework[] = [
  { id: 'hw-1', titre: 'Analyse d\'une faille Heartbleed', courseId: 'course-4', courseLabel: 'Sécurité', desc: 'Rédiger un rapport d\'analyse détaillé de la vulnérabilité Heartbleed OpenSSL avec des contre-mesures.', prio: 'haute', deadlineStr: 'Dans 3 jours', submissionsCount: 2 },
  { id: 'hw-2', titre: 'Implémentation de Dijkstra en Go', courseId: 'course-1', courseLabel: 'Algo', desc: 'Développer un algorithme de recherche du plus court chemin optimisé en utilisant des structures de tas binaires.', prio: 'normale', deadlineStr: 'Dans 5 jours', submissionsCount: 3 },
  { id: 'hw-3', titre: 'Préparation du Pitch de Projet L3', courseId: 'course-5', courseLabel: 'Speech', desc: 'Présenter une vidéo de 3 minutes décrivant votre concept innovant pour l\'incubateur de l\'école.', prio: 'haute', deadlineStr: 'Dans 1 jour', submissionsCount: 1 }
];

const MOCK_SCHEDULE_T1: ProfessorSchedule[] = [
  { id: 'sch-1', courseId: 'course-1', courseTitle: 'Algorithmique Avancée', day: 'Lundi', time: '08:00 - 11:00', room: 'Amphi A', type: 'CM', dateStr: 'Lundi 06 Juillet 2026', classe: 'L2 CM' },
  { id: 'sch-2', courseId: 'course-4', courseTitle: "Sécurité des Systèmes d'Information", day: 'Mardi', time: '13:00 - 16:00', room: 'Amphi B', type: 'CM', dateStr: 'Mardi 07 Juillet 2026', classe: 'L3 Développement Web' },
  { id: 'sch-3', courseId: 'course-1', courseTitle: 'TD Algorithmique Avancée', day: 'Mercredi', time: '10:00 - 12:00', room: 'Labo 5', type: 'TD', dateStr: 'Mercredi 08 Juillet 2026', classe: 'L2 CM' },
  { id: 'sch-wed-1', courseId: 'course-1', courseTitle: 'TD Algorithmique Avancée', day: 'Mercredi', time: '12:00 - 14:00', room: 'Labo 5', type: 'TD', dateStr: 'Mercredi 08 Juillet 2026', classe: 'L2 CM' },
  { id: 'sch-wed-2', courseId: 'course-4', courseTitle: "Sécurité des Systèmes d'Information", day: 'Mercredi', time: '17:00 - 20:00', room: 'Amphi B', type: 'CM', dateStr: 'Mercredi 08 Juillet 2026', classe: 'L3 Développement Web' },
];

const MOCK_SCHEDULE_T2: ProfessorSchedule[] = [
  { id: 'sch-4', courseId: 'course-2', courseTitle: 'Management Stratégique II', day: 'Mardi', time: '09:00 - 12:00', room: 'Salle C', type: 'CM', dateStr: 'Mardi 07 Juillet 2026', classe: 'Master IA' },
  { id: 'sch-5', courseId: 'course-5', courseTitle: 'Prise de Parole en Public', day: 'Jeudi', time: '10:00 - 13:00', room: 'Salle Rethorique 1', type: 'CM', dateStr: 'Jeudi 09 Juillet 2026', classe: 'L1 Développement Web' },
];

export function isCourseInFuture(dateStr: string): boolean {
  try {
    const parts = dateStr.split(' ');
    if (parts.length < 3) return true;
    const day = parseInt(parts[0]);
    const monthStr = parts[1].toLowerCase();
    const year = parseInt(parts[2]);
    let month = 6; // default July
    if (monthStr.startsWith('juin')) month = 5;
    else if (monthStr.startsWith('juil')) month = 6;
    
    // Course date at the end of its scheduled day (23:59:59)
    const courseDate = new Date(year, month, day, 23, 59, 59);
    // Reference date Saturday, July 4, 2026, 11:05:12
    const referenceDate = new Date(2026, 6, 4, 11, 5, 12);
    return courseDate.getTime() > referenceDate.getTime();
  } catch (err) {
    return true;
  }
}

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function hasTimeOverlap(time1: string, time2: string): boolean {
  try {
    const [start1Str, end1Str] = time1.split('-').map(s => s.trim());
    const [start2Str, end2Str] = time2.split('-').map(s => s.trim());
    
    const start1 = parseTimeToMinutes(start1Str);
    const end1 = parseTimeToMinutes(end1Str);
    const start2 = parseTimeToMinutes(start2Str);
    const end2 = parseTimeToMinutes(end2Str);
    
    return start1 < end2 && start2 < end1;
  } catch (err) {
    return false;
  }
}

function autoMarkPastDueCourses(sessions: any[]): any[] {
  let changed = false;
  const updated = sessions.map((s: any) => {
    if (s.status === 'a_venir' && !isCourseInFuture(s.dateStr)) {
      changed = true;
      return { ...s, status: 'non_fait' };
    }
    return s;
  });
  if (changed) {
    localStorage.setItem('shared_school_sessions', JSON.stringify(updated));
  }
  return updated;
}

const COURSE_CLASS_MAP: Record<string, string> = {
  'course-1': 'L2 CM',
  'course-4': 'L3 Développement Web',
  'course-2': 'Master IA',
  'course-5': 'L1 Développement Web',
};

export class InMemoryProfessorRepository implements ProfessorRepository {
  constructor() {
    // Migration: s'assurer que les anciennes clés contenant "Génie Civil" sont purgées pour refléter la nouvelle classe "L2 CM"
    if (!localStorage.getItem('p_migrated_to_l2_cm_v2')) {
      localStorage.removeItem('shared_school_sessions');
      localStorage.removeItem('p_grades');
      localStorage.removeItem('p_homeworks');
      localStorage.removeItem('p_lessons');
      localStorage.removeItem('p_modules');
      localStorage.removeItem('p_quizzes');
      localStorage.removeItem('p_reminders');
      localStorage.setItem('p_migrated_to_l2_cm_v2', 'true');
    }

    // Initialisation du localStorage si absent
    if (!localStorage.getItem('p_grades')) {
      localStorage.setItem('p_grades', JSON.stringify(DEFAULT_GRADES));
    }
    if (!localStorage.getItem('p_homeworks')) {
      localStorage.setItem('p_homeworks', JSON.stringify(DEFAULT_HOMEWORKS));
    }
    if (!localStorage.getItem('p_reminders')) {
      localStorage.setItem('p_reminders', JSON.stringify(DEFAULT_REMINDERS));
    }
    if (!localStorage.getItem('p_lessons')) {
      localStorage.setItem('p_lessons', JSON.stringify(DEFAULT_LESSONS));
    }
    if (!localStorage.getItem('p_modules')) {
      localStorage.setItem('p_modules', JSON.stringify(DEFAULT_MODULES));
    }
    if (!localStorage.getItem('p_quizzes')) {
      localStorage.setItem('p_quizzes', JSON.stringify(DEFAULT_QUIZZES));
    }
    
    const savedSessions = localStorage.getItem('shared_school_sessions');
    if (!savedSessions) {
      const initialSessions = [
        {
          id: 'p1',
          nom: 'Algorithmique Avancée',
          courseId: 'course-1',
          jour: 'LUN',
          jourComplet: 'Lundi',
          dateStr: '06 Juil 2026',
          heureDebut: '08:00',
          heureFin: '11:00',
          heureStr: '08:00 - 11:00',
          type: 'CM',
          salle: 'Amphi A',
          profId: 'usr-prof-01',
          professeur: 'Dr. Cheikh Anta',
          description: "Analyse de complexité théorique, structures de données avancées, graphes et programmation dynamique.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p2',
          nom: 'Éthique & Droit Numérique',
          courseId: 'course-ethique',
          jour: 'LUN',
          jourComplet: 'Lundi',
          dateStr: '06 Juil 2026',
          heureDebut: '10:00',
          heureFin: '12:05',
          heureStr: '10:00 - 12:05',
          type: 'CM',
          salle: 'Amphi B',
          profId: 'usr-prof-other',
          professeur: 'Dr. Kane',
          description: "Aspects juridiques des données à caractère personnel, législation cybernétique au Sénégal et éthique des algorithmes.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p3',
          nom: 'Développement Web Fullstack',
          courseId: 'course-web',
          jour: 'LUN',
          jourComplet: 'Lundi',
          dateStr: '06 Juil 2026',
          heureDebut: '14:00',
          heureFin: '16:00',
          heureStr: '14:00 - 16:00',
          type: 'TP',
          salle: 'Labo 10',
          profId: 'usr-prof-other',
          professeur: 'M. Malick Teuw',
          description: "Industrialisation d'une application React avec Vite, typage TypeScript strict, state managers et intégration back-end.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p4',
          nom: 'Anglais Technique',
          courseId: 'course-anglais',
          jour: 'MAR',
          jourComplet: 'Mardi',
          dateStr: '07 Juil 2026',
          heureDebut: '09:00',
          heureFin: '11:00',
          heureStr: '09:00 - 11:00',
          type: 'TD',
          salle: 'Salle 301',
          profId: 'usr-prof-other',
          professeur: 'Mrs. Ndiaye',
          description: "Lecture de documentations techniques en anglais informatique, rédaction de cahiers des charges et pitch de projets innovants.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p5',
          nom: 'Intelligence Artificielle',
          courseId: 'course-ia',
          jour: 'MAR',
          jourComplet: 'Mardi',
          dateStr: '07 Juil 2026',
          heureDebut: '13:00',
          heureFin: '16:00',
          heureStr: '13:00 - 16:00',
          type: 'CM',
          salle: 'Amphi A',
          profId: 'usr-prof-other',
          professeur: 'Prof. Sy',
          description: "Modélisation de réseaux neuronaux, apprentissage machine non-supervisé et applications du TAL.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p6',
          nom: 'Architecture Réseaux',
          courseId: 'course-reseaux',
          jour: 'MER',
          jourComplet: 'Mercredi',
          dateStr: '08 Juil 2026',
          heureDebut: '08:00',
          heureFin: '11:00',
          heureStr: '08:00 - 11:00',
          type: 'TP',
          salle: 'Labo 204',
          profId: 'usr-prof-other',
          professeur: 'M. Diop',
          description: "Modélisation de topologies physiques et virtuelles, routage dynamique, VPN IPSec et pare-feux de nouvelle génération.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p7',
          nom: 'Base de Données SQL',
          courseId: 'course-sql',
          jour: 'JEU',
          jourComplet: 'Jeudi',
          dateStr: '09 Juil 2026',
          heureDebut: '13:00',
          heureFin: '15:00',
          heureStr: '13:00 - 15:00',
          type: 'TD',
          salle: 'Salle 205',
          profId: 'usr-prof-other',
          professeur: 'Mme. Sow',
          description: "Modélisation relationnelle de données, algèbre relationnelle complexe et optimisation de requêtes d'agrégation SQL.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p8',
          nom: 'Cybersécurité',
          courseId: 'course-4',
          jour: 'JEU',
          jourComplet: 'Jeudi',
          dateStr: '09 Juil 2026',
          heureDebut: '15:00',
          heureFin: '17:00',
          heureStr: '15:00 - 17:00',
          type: 'CM',
          salle: 'Amphi C',
          profId: 'usr-prof-01',
          professeur: 'Dr. Cheikh Anta',
          description: "Analyse des vulnérabilités logicielles communes (OWASP Top 10), cryptographie asymétrique et réponse de crise cyber.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p9',
          nom: 'Mathématiques Appliquées',
          courseId: 'course-maths',
          jour: 'VEN',
          jourComplet: 'Vendredi',
          dateStr: '10 Juil 2026',
          heureDebut: '08:00',
          heureFin: '10:00',
          heureStr: '08:00 - 10:00',
          type: 'TD',
          salle: 'Salle 102',
          profId: 'usr-prof-other',
          professeur: 'Prof. Ba',
          description: "Probabilités discrètes et de Poisson, algèbre linéaire numérique, vecteurs propres et valeurs singulières appliquées au traitement du signal.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p10',
          nom: "Systèmes d'Exploitation",
          courseId: 'course-os',
          jour: 'VEN',
          jourComplet: 'Vendredi',
          dateStr: '10 Juil 2026',
          heureDebut: '10:00',
          heureFin: '12:00',
          heureStr: '10:00 - 12:00',
          type: 'TP',
          salle: 'Salle Info 4',
          profId: 'usr-prof-other',
          professeur: 'M. Sene',
          description: "Concurrence de processus, sémaphores de Dijkstra, gestion de la mémoire paginée et programmation système Bash/C.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p11',
          nom: 'TD Algorithmique Avancée',
          courseId: 'course-1',
          jour: 'MER',
          jourComplet: 'Mercredi',
          dateStr: '08 Juil 2026',
          heureDebut: '10:00',
          heureFin: '12:00',
          heureStr: '10:00 - 12:00',
          type: 'TD',
          salle: 'Labo 5',
          profId: 'usr-prof-01',
          professeur: 'Dr. Cheikh Anta',
          description: "Séance pratique d'exercices sur la complexité et les tris.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p-wed-12-14',
          nom: 'TD Algorithmique Avancée',
          courseId: 'course-1',
          jour: 'MER',
          jourComplet: 'Mercredi',
          dateStr: '08 Juil 2026',
          heureDebut: '12:00',
          heureFin: '14:00',
          heureStr: '12:00 - 14:00',
          type: 'TD',
          salle: 'Labo 5',
          profId: 'usr-prof-01',
          professeur: 'Dr. Cheikh Anta',
          description: "Séance pratique d'exercices de niveau avancé sur la complexité et les tris.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p-wed-17-20',
          nom: "Sécurité des Systèmes d'Information",
          courseId: 'course-4',
          jour: 'MER',
          jourComplet: 'Mercredi',
          dateStr: '08 Juil 2026',
          heureDebut: '17:00',
          heureFin: '20:00',
          heureStr: '17:00 - 20:00',
          type: 'CM',
          salle: 'Amphi B',
          profId: 'usr-prof-01',
          professeur: 'Dr. Cheikh Anta',
          description: "Introduction aux concepts de cryptographie, modélisation de menaces et protocoles de communication sécurisés.",
          status: 'a_venir',
          cancellationReason: ''
        },
        {
          id: 'p-past-1',
          nom: 'Algorithmique Avancée (Ancien)',
          courseId: 'course-1',
          jour: 'LUN',
          jourComplet: 'Lundi',
          dateStr: '29 Juin 2026',
          heureDebut: '08:00',
          heureFin: '10:00',
          heureStr: '08:00 - 10:00',
          type: 'CM',
          salle: 'Amphi A',
          profId: 'usr-prof-01',
          professeur: 'Dr. Cheikh Anta',
          description: "Analyse de complexité théorique, structures de données avancées.",
          status: 'non_fait',
          cancellationReason: ''
        }
      ];
      localStorage.setItem('shared_school_sessions', JSON.stringify(initialSessions));
    } else {
      try {
        const sessions = JSON.parse(savedSessions);
        const hasWed1 = sessions.some((s: any) => s.id === 'p-wed-12-14');
        const hasWed2 = sessions.some((s: any) => s.id === 'p-wed-17-20');
        if (!hasWed1 || !hasWed2) {
          const newSessions = [...sessions];
          if (!hasWed1) {
            newSessions.push({
              id: 'p-wed-12-14',
              nom: 'TD Algorithmique Avancée',
              courseId: 'course-1',
              jour: 'MER',
              jourComplet: 'Mercredi',
              dateStr: '08 Juil 2026',
              heureDebut: '12:00',
              heureFin: '14:00',
              heureStr: '12:00 - 14:00',
              type: 'TD',
              salle: 'Labo 5',
              profId: 'usr-prof-01',
              professeur: 'Dr. Cheikh Anta',
              description: "Séance pratique d'exercices de niveau avancé sur la complexité et les tris.",
              status: 'a_venir',
              cancellationReason: ''
            });
          }
          if (!hasWed2) {
            newSessions.push({
              id: 'p-wed-17-20',
              nom: "Sécurité des Systèmes d'Information",
              courseId: 'course-4',
              jour: 'MER',
              jourComplet: 'Mercredi',
              dateStr: '08 Juil 2026',
              heureDebut: '17:00',
              heureFin: '20:00',
              heureStr: '17:00 - 20:00',
              type: 'CM',
              salle: 'Amphi B',
              profId: 'usr-prof-01',
              professeur: 'Dr. Cheikh Anta',
              description: "Introduction aux concepts de cryptographie, modélisation de menaces et protocoles de communication sécurisés.",
              status: 'a_venir',
              cancellationReason: ''
            });
          }
          localStorage.setItem('shared_school_sessions', JSON.stringify(newSessions));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  private getModulesFromStorage(): CourseModule[] {
    const data = localStorage.getItem('p_modules');
    return data ? JSON.parse(data) : DEFAULT_MODULES;
  }

  private saveModulesToStorage(modules: CourseModule[]) {
    localStorage.setItem('p_modules', JSON.stringify(modules));
  }

  private getQuizzesFromStorage(): CourseQuiz[] {
    const data = localStorage.getItem('p_quizzes');
    return data ? JSON.parse(data) : DEFAULT_QUIZZES;
  }

  private saveQuizzesToStorage(quizzes: CourseQuiz[]) {
    localStorage.setItem('p_quizzes', JSON.stringify(quizzes));
  }

  private getLessonsFromStorage(): ProfessorLesson[] {
    const data = localStorage.getItem('p_lessons');
    return data ? JSON.parse(data) : DEFAULT_LESSONS;
  }

  private saveLessonsToStorage(lessons: ProfessorLesson[]) {
    localStorage.setItem('p_lessons', JSON.stringify(lessons));
  }

  private getGradesFromStorage(): StudentGrade[] {
    const data = localStorage.getItem('p_grades');
    return data ? JSON.parse(data) : DEFAULT_GRADES;
  }

  private saveGradesToStorage(grades: StudentGrade[]) {
    localStorage.setItem('p_grades', JSON.stringify(grades));
  }

  private getHomeworksFromStorage(): ProfessorHomework[] {
    const data = localStorage.getItem('p_homeworks');
    return data ? JSON.parse(data) : DEFAULT_HOMEWORKS;
  }

  private saveHomeworksToStorage(hw: ProfessorHomework[]) {
    localStorage.setItem('p_homeworks', JSON.stringify(hw));
  }

  private getRemindersFromStorage(): ClassroomReminder[] {
    const data = localStorage.getItem('p_reminders');
    return data ? JSON.parse(data) : DEFAULT_REMINDERS;
  }

  private saveRemindersToStorage(rem: ClassroomReminder[]) {
    localStorage.setItem('p_reminders', JSON.stringify(rem));
  }

  async getCourses(profId: string): Promise<ProfessorCourse[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Pr. Cheikh Anta est 'usr-prof-01', Mme. Seynabou Sene est 'usr-prof-02'
    if (profId === 'usr-prof-02') {
      return MOCK_COURSES_TEACHER_2;
    }
    return MOCK_COURSES_TEACHER_1;
  }

  async getStudents(courseId: string): Promise<StudentEnrolled[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_STUDENTS;
  }

  async getGrades(courseId: string): Promise<StudentGrade[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allGrades = this.getGradesFromStorage();
    return allGrades.filter(g => g.courseId === courseId);
  }

  async updateGrade(courseId: string, studentId: string, cc: number, examen: number): Promise<StudentGrade> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allGrades = this.getGradesFromStorage();
    
    // Règle métier : 40% CC, 60% Examen
    const finalGrade = Math.round(((cc * 0.4) + (examen * 0.6)) * 10) / 10;
    const status = finalGrade >= 10 ? 'Validé' : 'Rattrapage';

    const index = allGrades.findIndex(g => g.courseId === courseId && g.studentId === studentId);
    
    let updatedGrade: StudentGrade;

    if (index >= 0) {
      const existing = allGrades[index];
      updatedGrade = {
        ...existing,
        cc,
        examen,
        finalGrade,
        status
      };
      allGrades[index] = updatedGrade;
    } else {
      const student = MOCK_STUDENTS.find(s => s.id === studentId);
      updatedGrade = {
        id: `gr-${Date.now()}`,
        studentId,
        studentNom: student ? `${student.prenom} ${student.nom}` : 'Étudiant',
        courseId,
        cc,
        examen,
        finalGrade,
        status
      };
      allGrades.push(updatedGrade);
    }

    this.saveGradesToStorage(allGrades);

    // Envoyer une notification en temps réel à l'étudiant
    try {
      const course = [...MOCK_COURSES_TEACHER_1, ...MOCK_COURSES_TEACHER_2].find(c => c.id === courseId);
      const courseTitle = course ? course.titre : "un module";
      const payload = {
        title: `Nouvelle note publiée`,
        desc: `Votre note pour le cours de "${courseTitle}" a été mise à jour : Moyenne ${finalGrade}/20 (${status}).`,
        time: "À l'instant",
        read: false,
        icon: "grade",
        color: "text-[#E3A857] bg-[#E3A857]/10"
      };

      // Notification locale (localStorage)
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({
        id: `notif-${Date.now()}`,
        ...payload
      });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));

      // Notification Firestore temps réel
      notificationRepository.sendNotification(payload).catch(err => {
        console.error("Firestore notification failed:", err);
      });
    } catch (e) {
      console.error("Failed to generate grade notification:", e);
    }

    return updatedGrade;
  }

  async getHomeworks(courseId: string): Promise<ProfessorHomework[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allHomeworks = this.getHomeworksFromStorage();
    return allHomeworks.filter(h => h.courseId === courseId);
  }

  async createHomework(courseId: string, titre: string, desc: string, prio: 'haute' | 'normale', deadlineStr: string): Promise<ProfessorHomework> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const allHomeworks = this.getHomeworksFromStorage();

    // Déterminer un label court
    let courseLabel = 'Devoir';
    const cTeacher1 = MOCK_COURSES_TEACHER_1.find(c => c.id === courseId);
    const cTeacher2 = MOCK_COURSES_TEACHER_2.find(c => c.id === courseId);
    if (cTeacher1) courseLabel = cTeacher1.titre.substring(0, 10);
    else if (cTeacher2) courseLabel = cTeacher2.titre.substring(0, 10);

    const newHw: ProfessorHomework = {
      id: `hw-${Date.now()}`,
      titre,
      courseId,
      courseLabel,
      desc,
      prio,
      deadlineStr: `Jusqu'au ${deadlineStr}`,
      submissionsCount: 0
    };

    allHomeworks.push(newHw);
    this.saveHomeworksToStorage(allHomeworks);
    return newHw;
  }

  async getSchedule(profId: string): Promise<ProfessorSchedule[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const saved = localStorage.getItem('shared_school_sessions');
    if (saved) {
      try {
        let sessions = JSON.parse(saved);
        // Auto-mark past courses that have not been dealt with as 'non_fait'
        sessions = autoMarkPastDueCourses(sessions);
        
        return sessions
          .filter((s: any) => s.profId === profId)
          .map((s: any) => ({
            id: s.id,
            courseTitle: s.nom,
            day: s.jourComplet,
            time: s.heureStr,
            room: s.salle,
            type: s.type,
            status: s.status,
            cancellationReason: s.cancellationReason || '',
            dateStr: s.dateStr,
            jour: s.jour,
            courseId: s.courseId,
            classe: s.courseId ? (COURSE_CLASS_MAP[s.courseId] || 'L3-GL') : 'L3-GL'
          }));
      } catch (err) {
        console.error("Failed to parse shared_school_sessions:", err);
      }
    }
    if (profId === 'usr-prof-02') {
      return MOCK_SCHEDULE_T2;
    }
    return MOCK_SCHEDULE_T1;
  }

  async cancelCourse(sessionId: string, reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const saved = localStorage.getItem('shared_school_sessions');
    if (!saved) return;
    try {
      const sessions = JSON.parse(saved);
      const index = sessions.findIndex((s: any) => s.id === sessionId);
      if (index === -1) throw new Error("Séance introuvable");
      
      const session = sessions[index];
      
      if (!isCourseInFuture(session.dateStr)) {
        throw new Error("Impossible d'annuler un cours déjà passé ou en cours.");
      }
      
      sessions[index] = {
        ...session,
        status: 'annule',
        cancellationReason: reason
      };
      
      localStorage.setItem('shared_school_sessions', JSON.stringify(sessions));
      
      const payload = {
        title: `Cours Annulé : ${session.nom}`,
        desc: `Le cours de ${session.nom} prévu le ${session.jourComplet} à ${session.heureStr} est ANNULÉ.${reason ? ' Motif : ' + reason : ''}`,
        time: "À l'instant",
        read: false,
        icon: "cancel",
        color: "text-brand-red-deep bg-brand-red-light"
      };

      // Notify students via student_notifications local storage for backward compatibility
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({
        id: `notif-${Date.now()}`,
        ...payload
      });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));

      // Real-time Firestore notification
      notificationRepository.sendNotification(payload).catch(err => {
        console.error("Failed to send Firestore notification:", err);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async rescheduleCourse(sessionId: string, day: string, time: string, room: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const saved = localStorage.getItem('shared_school_sessions');
    if (!saved) return;
    try {
      const sessions = JSON.parse(saved);
      const index = sessions.findIndex((s: any) => s.id === sessionId);
      if (index === -1) throw new Error("Séance introuvable");
      
      const session = sessions[index];
      
      if (!isCourseInFuture(session.dateStr)) {
        throw new Error("Impossible de modifier un cours déjà passé.");
      }
      
      // Standardize day & dayCode
      let dayCode: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' = 'LUN';
      let dayComplet = day;
      const dLower = day.toLowerCase();
      if (dLower.startsWith('lu') || dLower === 'lun') { dayCode = 'LUN'; dayComplet = 'Lundi'; }
      else if (dLower.startsWith('ma') || dLower === 'mar') { dayCode = 'MAR'; dayComplet = 'Mardi'; }
      else if (dLower.startsWith('me') || dLower === 'mer') { dayCode = 'MER'; dayComplet = 'Mercredi'; }
      else if (dLower.startsWith('je') || dLower === 'jeu') { dayCode = 'JEU'; dayComplet = 'Jeudi'; }
      else if (dLower.startsWith('ve') || dLower === 'ven') { dayCode = 'VEN'; dayComplet = 'Vendredi'; }
      
      // Determine dateStr dynamically based on day of the week of July 6, 2026
      let dayOffset = 0;
      if (dayCode === 'LUN') dayOffset = 0;
      else if (dayCode === 'MAR') dayOffset = 1;
      else if (dayCode === 'MER') dayOffset = 2;
      else if (dayCode === 'JEU') dayOffset = 3;
      else if (dayCode === 'VEN') dayOffset = 4;
      
      const dateVal = new Date(2026, 6, 6 + dayOffset); // Starting from Monday, July 6, 2026
      const monthNames = ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
      const newDateStr = `${String(dateVal.getDate()).padStart(2, '0')} ${monthNames[dateVal.getMonth()]} ${dateVal.getFullYear()}`;
      
      // Conflict checking: class has no other active courses at the same hour
      const [newStart, newEnd] = time.split('-').map(s => s.trim());
      
      for (const s of sessions) {
        if (s.id !== sessionId && s.jour === dayCode && s.status !== 'annule') {
          if (hasTimeOverlap(time, s.heureStr)) {
            throw new Error(`Conflit d'horaire : La classe a déjà un cours de "${s.nom}" (${s.type}) le ${dayComplet} de ${s.heureStr}.`);
          }
        }
      }
      
      const originalTime = session.heureStr;
      const originalDay = session.jourComplet;
      
      sessions[index] = {
        ...session,
        jour: dayCode,
        jourComplet: dayComplet,
        dateStr: newDateStr,
        heureDebut: newStart,
        heureFin: newEnd,
        heureStr: time,
        salle: room,
        status: 'reprogramme',
        isModified: true
      };
      
      localStorage.setItem('shared_school_sessions', JSON.stringify(sessions));
      
      const payload = {
        title: `Cours Reprogrammé : ${session.nom}`,
        desc: `Le cours de ${session.nom} du ${originalDay} à ${originalTime} a été déplacé au ${dayComplet} de ${time} (Salle : ${room}).`,
        time: "À l'instant",
        read: false,
        icon: "calendar_today",
        color: "text-brand-red-deep bg-brand-red-light"
      };

      // Notify students via student_notifications local storage for backward compatibility
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({
        id: `notif-${Date.now()}`,
        ...payload
      });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));

      // Real-time Firestore notification
      notificationRepository.sendNotification(payload).catch(err => {
        console.error("Failed to send Firestore notification:", err);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getVigilCheckIns(): Promise<VigilCheckIn[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Récupérer les logs scannés par le vigile enregistrés dans localStorage ('v_scan_logs')
    const saved = localStorage.getItem('v_scan_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          id: item.id || Date.now().toString(),
          name: item.name || 'Inconnu',
          studentId: item.studentId || 'Badge inconnu',
          statut: item.status === 'Autorisé' ? 'Autorisé' : 'Refusé',
          time: item.time || '10:00',
          date: item.date || "Aujourd'hui",
          type: item.type || 'Scanner',
          avatar: item.avatar || null
        }));
      } catch (err) {
        console.error('Failed to parse v_scan_logs:', err);
      }
    }
    
    // Fallback de logs réalistes
    return [
      { id: '1', name: 'Assane Diop', studentId: '221-E001', statut: 'Autorisé', time: '08:02', date: "Aujourd'hui", type: 'Scanner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
      { id: '2', name: 'Fatou Sow', studentId: '221-E002', statut: 'Autorisé', time: '07:58', date: "Aujourd'hui", type: 'Scanner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
      { id: '3', name: 'Malick Ndiaye', studentId: '221-E003', statut: 'Autorisé', time: '07:45', date: "Aujourd'hui", type: 'Scanner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
    ];
  }

  async getReminders(courseId: string): Promise<ClassroomReminder[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const allReminders = this.getRemindersFromStorage();
    return allReminders.filter(r => r.courseId === courseId);
  }

  async createReminder(courseId: string, content: string, isUrgent: boolean): Promise<ClassroomReminder> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allReminders = this.getRemindersFromStorage();
    
    // Find associated course room/salle
    const course = [...MOCK_COURSES_TEACHER_1, ...MOCK_COURSES_TEACHER_2].find(c => c.id === courseId);
    const salle = course ? course.salle : "Amphi A";
    const courseName = course ? course.titre : "";

    const newRem: ClassroomReminder = {
      id: `rem-${Date.now()}`,
      courseId,
      content,
      dateStr: "À l'instant",
      isUrgent,
      room: salle,
      salle: salle
    };
    allReminders.unshift(newRem); // Display newest reminders first
    this.saveRemindersToStorage(allReminders);

    // Push real-time notification to students
    try {
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({
        id: `notif-${Date.now()}`,
        title: isUrgent ? `🚨 Rappel Urgent (Salle ${salle})` : `📢 Rappel de Cours (Salle ${salle})`,
        desc: `${courseName ? courseName + ' : ' : ''}${content}`,
        time: "À l'instant",
        read: false,
        icon: isUrgent ? "warning" : "campaign",
        color: isUrgent ? "text-brand-red-deep bg-brand-red-light" : "text-[#E3A857] bg-[#E3A857]/10"
      });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
    } catch (e) {
      console.error("Failed to append student notification from professor reminder", e);
    }

    return newRem;
  }

  async getLessons(courseId: string): Promise<ProfessorLesson[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const allLessons = this.getLessonsFromStorage();
    return allLessons.filter(l => l.courseId === courseId);
  }

  async createLesson(courseId: string, title: string, description: string, attachmentName?: string, attachmentUrl?: string, moduleId?: string): Promise<ProfessorLesson> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allLessons = this.getLessonsFromStorage();
    const newLesson: ProfessorLesson = {
      id: `les-${Date.now()}`,
      courseId,
      moduleId,
      title,
      description,
      dateStr: "À l'instant",
      attachmentName,
      attachmentUrl
    };
    allLessons.unshift(newLesson);
    this.saveLessonsToStorage(allLessons);
    return newLesson;
  }

  async getModules(courseId: string): Promise<CourseModule[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const allModules = this.getModulesFromStorage();
    return allModules.filter(m => m.courseId === courseId);
  }

  async createModule(courseId: string, title: string, description: string): Promise<CourseModule> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allModules = this.getModulesFromStorage();
    const newModule: CourseModule = {
      id: `mod-${Date.now()}`,
      courseId,
      title,
      description
    };
    allModules.push(newModule);
    this.saveModulesToStorage(allModules);
    return newModule;
  }

  async getQuizzes(courseId: string): Promise<CourseQuiz[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const allModules = this.getModulesFromStorage();
    const courseModuleIds = allModules.filter(m => m.courseId === courseId).map(m => m.id);
    const allQuizzes = this.getQuizzesFromStorage();
    return allQuizzes.filter(q => courseModuleIds.includes(q.moduleId));
  }

  async createQuiz(moduleId: string, title: string, description: string, questions: QuizQuestion[]): Promise<CourseQuiz> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allQuizzes = this.getQuizzesFromStorage();
    const newQuiz: CourseQuiz = {
      id: `quiz-${Date.now()}`,
      moduleId,
      title,
      description,
      questions
    };
    allQuizzes.push(newQuiz);
    this.saveQuizzesToStorage(allQuizzes);
    return newQuiz;
  }
}
