import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    nom: 'Architecture logicielle avancée',
    description: 'Étude des patterns microservices, de la scalabilité horizontale et des architectures événementielles dans les environnements cloud modernes.',
    categorie: 'Informatique & Dév',
    statut: 'en_cours',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
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
