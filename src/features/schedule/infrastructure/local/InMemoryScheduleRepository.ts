import { CourseSession } from '../../domain/Schedule';
import { ScheduleRepository } from '../../domain/ScheduleRepository';

const MOCK_SCHEDULE: CourseSession[] = [
  {
    id: "p1",
    nom: "Algorithmique Avancée",
    jour: "LUN",
    jourComplet: "LUNDI",
    dateStr: "23 Oct",
    heureDebut: "08:00",
    heureFin: "10:00",
    heureStr: "08:00 - 10:00",
    type: "CM",
    salle: "Amphi A",
    professeur: "Dr. Aly Diatta",
    description: "Analyse de complexité théorique, structures de données avancées, graphes et programmation dynamique.",
    status: "termine"
  },
  {
    id: "p2",
    nom: "Éthique & Droit Numérique",
    jour: "LUN",
    jourComplet: "LUNDI",
    dateStr: "23 Oct",
    heureDebut: "10:00",
    heureFin: "12:05",
    heureStr: "10:00 - 12:00",
    type: "CM",
    salle: "Amphi B",
    professeur: "Dr. Kane",
    description: "Aspects juridiques des données à caractère personnel, législation cybernétique au Sénégal et éthique des algorithmes.",
    status: "termine"
  },
  {
    id: "p3",
    nom: "Développement Web Fullstack",
    jour: "LUN",
    jourComplet: "LUNDI",
    dateStr: "23 Oct",
    heureDebut: "14:00",
    heureFin: "16:00",
    heureStr: "14:00 - 16:00",
    type: "TP",
    salle: "Labo 10",
    professeur: "M. Malick Teuw",
    description: "Industrialisation d'une application React avec Vite, typage TypeScript strict, state managers et intégration back-end.",
    status: "termine"
  },
  {
    id: "p4",
    nom: "Anglais Technique",
    jour: "MAR",
    jourComplet: "MARDI",
    dateStr: "24 Oct",
    heureDebut: "09:00",
    heureFin: "11:00",
    heureStr: "09:00 - 11:00",
    type: "TD",
    salle: "Salle 301",
    professeur: "Mrs. Ndiaye",
    description: "Lecture de documentations techniques en anglais informatique, rédaction de cahiers des charges et pitch de projets innovants.",
    status: "termine"
  },
  {
    id: "p5",
    nom: "Intelligence Artificielle",
    jour: "MAR",
    jourComplet: "MARDI",
    dateStr: "24 Oct",
    heureDebut: "13:00",
    heureFin: "16:00",
    heureStr: "13:00 - 16:00",
    type: "CM",
    salle: "Amphi A",
    professeur: "Prof. Sy",
    description: "Modélisation de réseaux neuronaux, apprentissage machine non-supervisé et applications du TAL.",
    status: "termine"
  },
  {
    id: "p6",
    nom: "Architecture Réseaux",
    jour: "MER",
    jourComplet: "MERCREDI",
    dateStr: "25 Oct",
    heureDebut: "08:00",
    heureFin: "11:00",
    heureStr: "08:00 - 11:00",
    type: "TP",
    salle: "Labo 204",
    professeur: "M. Diop",
    description: "Modélisation de topologies physiques et virtuelles, routage dynamique, VPN IPSec et pare-feux de nouvelle génération.",
    status: "actuel"
  },
  {
    id: "p7",
    nom: "Base de Données SQL",
    jour: "JEU",
    jourComplet: "JEUDI",
    dateStr: "26 Oct",
    heureDebut: "13:00",
    heureFin: "15:00",
    heureStr: "13:00 - 15:00",
    type: "TD",
    salle: "Salle 205",
    professeur: "Mme. Sow",
    description: "Modélisation relationnelle de données, algèbre relationnelle complexe et optimisation de requêtes d'agrégation SQL.",
    status: "a_venir"
  },
  {
    id: "p8",
    nom: "Cybersécurité",
    jour: "JEU",
    jourComplet: "JEUDI",
    dateStr: "26 Oct",
    heureDebut: "15:00",
    heureFin: "17:00",
    heureStr: "15:00 - 17:00",
    type: "CM",
    salle: "Amphi C",
    professeur: "Dr. Wade",
    description: "Analyse des vulnérabilités logicielles communes (OWASP Top 10), cryptographie asymétrique et réponse de crise cyber.",
    status: "a_venir"
  },
  {
    id: "p9",
    nom: "Mathématiques Appliquées",
    jour: "VEN",
    jourComplet: "VENDREDI",
    dateStr: "27 Oct",
    heureDebut: "08:00",
    heureFin: "10:00",
    heureStr: "08:00 - 10:00",
    type: "TD",
    salle: "Salle 102",
    professeur: "Prof. Ba",
    description: "Probabilités discrètes et de Poisson, algèbre linéaire numérique, vecteurs propres et valeurs singulières appliquées au traitement du signal.",
    status: "a_venir"
  },
  {
    id: "p10",
    nom: "Systèmes d'Exploitation",
    jour: "VEN",
    jourComplet: "VENDREDI",
    dateStr: "27 Oct",
    heureDebut: "10:00",
    heureFin: "12:00",
    heureStr: "10:00 - 12:00",
    type: "TP",
    salle: "Salle Info 4",
    professeur: "M. Sene",
    description: "Concurrence de processus, sémaphores de Dijkstra, gestion de la mémoire paginée et programmation système Bash/C.",
    status: "a_venir"
  }
];

export class InMemoryScheduleRepository implements ScheduleRepository {
  async getWeeklySchedule(): Promise<CourseSession[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const saved = localStorage.getItem('shared_school_sessions');
    if (saved) {
      try {
        const sessions = JSON.parse(saved);
        return sessions.map((s: any) => ({
          id: s.id,
          nom: s.nom,
          jour: s.jour,
          jourComplet: s.jourComplet.toUpperCase(),
          dateStr: s.dateStr,
          heureDebut: s.heureDebut,
          heureFin: s.heureFin,
          heureStr: s.heureStr,
          type: s.type,
          salle: s.salle,
          professeur: s.professeur,
          description: s.description || '',
          status: s.status,
          cancellationReason: s.cancellationReason || ''
        }));
      } catch (err) {
        console.error("Failed parsing shared_school_sessions for student:", err);
      }
    }
    return MOCK_SCHEDULE;
  }
}
