import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    nom: 'Architecture logicielle avancée',
    description: 'Étude des patterns microservices, de la scalabilité horizontale et des architectures événementielles dans les environnements cloud modernes.',
    categorie: 'Informatique & Dév',
    statut: 'en_cours',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0VorEKdIaEYrqZldRDrj5sT9wWDZXXRRopiH2_gyGwEBi3WyVbiDkTQT9_NpcXQXZsTkGZkOamsc4ZatQy4PppWeKzNEjTTudbieFv2KkZepc2NtpR8KwrCkvuWiS6Nki3Rdj_WfpmsYfjaKCZSUjA-H9wzWKNcOys1GEJusf33lRJ0vOUnm4MCAflsjGm8Ln4Waa-bj4xXrHn51xLXlhtoFCrOPYU5QowSE9-48ehkMPGN5qM7mj29R0JGeu_cSI6haFDhs142w',
    progression: 65,
    professeur: 'Dr. Aly Diatta',
    salle: 'Amphi A',
    volumeHoraire: '45 heures',
    prochainCours: 'Lundi à 08:00'
  },
  {
    id: 'course-2',
    nom: 'Management Stratégique II',
    description: 'Analyse des décisions d\'entreprise dans un contexte globalisé et digital. Consolidation de la gouvernance et études de cas réels d\'Afrique de l\'Ouest.',
    categorie: 'Management & Business',
    statut: 'en_cours',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBru3tJ5ppJ1au9Hc_aQ9k9nD8bLuCxfdNMp9fHnGwm_84zcs2RDZ73AGPt5N9FbdHcJzGcP6UUVDe1EnWAVe9o_0FENPZ3nhA97w9WwLvSHyBoFuu72AGk6gmNLk4fsP3W9hZx3fKDLjz60LsnjletSIH23MRxqkPWSsKUJBtD9x2Q7e4QyC391QY66vQNlTABXKZ75QScstCJiPlBxELJiUWtf9ZiyGGY55rTYdMQtLuCLHWqONFdXHGtG9fXXZMfI-Z74allon8',
    progression: 40,
    professeur: 'M. Malick Teuw',
    salle: 'Salle de séminaire C',
    volumeHoraire: '32 heures',
    prochainCours: 'Mardi à 09:00'
  },
  {
    id: 'course-3',
    nom: 'Fondamentaux du DevOps',
    description: 'Mise en place de pipelines CI/CD automatisés, conteneurisation avec Docker et orchestrateurs pour une synergie développement/opérations optimale.',
    categorie: 'Informatique & Dév',
    statut: 'termine',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqsjRaMWPZws_ytBSaYJmbcjHPlhC3ZknKRz6Xzp9_MBDQxOzQQ4-eQbVm2-oQZ9AxyqSCt_QkEKb4FCaPLqtCdJ6fgGwDJPHyjM_UXRDKHZtyhLsloKo2Rmi-Z-wVYOLyNLo63W1xOt6Mk7apBpl5VQvr-6AY4eLR6DR0qKBfl9-4ttcNAwbwVcKpcc2IHCA_vXL2n6ctmTVmeMOSTqTDPbeRz_VupJzLT3rAZKwaXK6DFjGqGnDsVgW4rW2FDKklnG8yl8D_l6k',
    progression: 100,
    noteFinale: '17.5 / 20',
    professeur: 'M. Ibrahima Diagne',
    salle: 'Labo Réseaux 1',
    volumeHoraire: '40 heures'
  },
  {
    id: 'course-4',
    nom: 'Sécurité des Systèmes d\'Information',
    description: 'Introduction à la cryptographie moderne, l\'audit de sécurité de niveau entreprise, par-feux de nouvelle génération et conformité RGPD/Sénégal.',
    categorie: 'Informatique & Dév',
    statut: 'non_demarre',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFDrt_PA4X_qDt1rbI7fGNLuIUa1sW-9gl88InYzxmHi4xRUJT4iLn30fEwcGPrSSOHyNxPooEBOOvd6cIPOXiqXrSOhvPiHpfILerVvvPeCO8DzzyPRVev-znwKD7KCGf6omxcyTeh6D7KR5eefVdAH-vgbTsgM4JgdYl_W0fcvN2OmLb4HFVPEIwPbC3sWS8AQ_TqwU9VqeDXwrH3Yv3U1tYV5uhViGh2-0cstF1JP9F8r0IrVR1Uk5cwTS3nva5NfybpEYdgv4',
    progression: 0,
    avis: '4.9 (240 avis)',
    professeur: 'Dr. Cheikh Anta',
    salle: 'Amphi B',
    volumeHoraire: '36 heures'
  },
  {
    id: 'course-5',
    nom: 'Prise de Parole en Public',
    description: 'Techniques d\'expression orale, gestion du trac, structuration de pitchs commerciaux et art de convaincre avec de l\'impact émotif.',
    categorie: 'Soft Skills',
    statut: 'termine',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQL9_EMnd-N8W7X6w_OplACkDHFQ2l5MtwjdkpWqC-SiZYTIVwNT70mNifCg4W_qtdT8LM-fj6hrYsRn-p0vAcHgRtJ-5KwQetUaRxPKNb19rYinpegcRSyxMOkdU35KewlOk9C58WlFL9Pie8-oEUlyz_lJmZkHAO4ft4lTH_4SRIl0uzFcqVGXxmVElfIsXtoHED3Bz62V7f8msM_49hz5NI0WPQ9YT5eLhy5NpxI7T_NuLoEx9XaSvQLgUTcjnqiTVsuiKD7o',
    progression: 100,
    noteFinale: '18.0 / 20',
    professeur: 'Mme. Seynabou Sene',
    salle: 'Salle Rethorique 1',
    volumeHoraire: '20 heures'
  }
];

export class InMemoryCourseRepository implements CourseRepository {
  async getStudentCourses(): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 600)); // Latence artificielle
    return MOCK_COURSES;
  }
}
