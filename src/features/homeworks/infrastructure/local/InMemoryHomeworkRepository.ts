import { Homework } from '../../domain/Homework';
import { HomeworkRepository } from '../../domain/HomeworkRepository';

// Fausse base de données en mémoire (sera réinitialisée au rechargement de la page)
let memoryDB: Homework[] = [
  {
    id: "t1",
    titre: "Wireframing Dashboard Portal",
    cours: "UI/UX Design",
    coursLabel: "UI/UX Design",
    desc: "Créer les wireframes basse fidélité pour le module de gestion des notes.",
    prio: "haute",
    statut: "a_faire",
    deadlineStr: "2 jours restants",
  },
  {
    id: "t2",
    titre: "Analyse de Marché EdTech",
    cours: "Marketing Digital",
    coursLabel: "Marketing",
    desc: "Étude comparative des plateformes LMS majeures en Afrique de l'Ouest.",
    prio: "normale",
    statut: "a_faire",
    deadlineStr: "12 Oct",
  },
  {
    id: "t3",
    titre: "TP Arbres Binaires",
    cours: "Développement Fullstack",
    coursLabel: "Algo & Structure",
    desc: "Implémentation d'arbres de recherche binaire optimisés et parcours.",
    prio: "haute",
    statut: "en_cours",
    deadlineStr: "Dernière modif: Il y a 2h",
    progress: 65,
  },
  {
    id: "t4",
    titre: "Requêtes SQL Avancées",
    cours: "Data Science",
    coursLabel: "Base de Données",
    desc: "Optimisation de requêtes avec des jointures multiples et indexation.",
    prio: "normale",
    statut: "soumis",
    deadlineStr: "Fini le 15 Oct",
    note: "18 / 20",
  },
  {
    id: "t5",
    titre: "Presentation Pitch",
    cours: "UI/UX Design",
    coursLabel: "Anglais Pro",
    desc: "Pitcher une solution SaaS EdTech innovante devant un jury fictif.",
    prio: "normale",
    statut: "soumis",
    deadlineStr: "Fini le 18 Oct",
    attente: true,
  }
];

export class InMemoryHomeworkRepository implements HomeworkRepository {
  async getHomeworks(): Promise<Homework[]> {
    await new Promise(resolve => setTimeout(resolve, 600)); // Latence réseau simulée
    return [...memoryDB]; // Retourne une copie pour éviter les mutations
  }

  async saveHomework(homework: Homework): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    memoryDB = [homework, ...memoryDB]; // Ajoute au début
  }

  async startHomework(homeworkId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    memoryDB = memoryDB.map(hw => 
      hw.id === homeworkId ? { ...hw, statut: 'en_cours', progress: 0 } : hw
    );
  }

  async advanceHomeworkProgress(homeworkId: string, addedProgress: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    memoryDB = memoryDB.map(hw => {
      if (hw.id === homeworkId) {
        const next = (hw.progress || 0) + addedProgress;
        if (next >= 100) {
          return { ...hw, progress: 100, statut: 'soumis', attente: true };
        }
        return { ...hw, progress: next };
      }
      return hw;
    });
  }

  async submitHomework(homeworkId: string, fileData: File | Blob): Promise<void> {
    if (fileData) {
      // Simulation active
    }
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation de l'upload du fichier
    memoryDB = memoryDB.map(hw => {
      if (hw.id === homeworkId) {
        return { ...hw, statut: 'soumis', progress: 100, deadlineStr: "À l'instant", attente: true };
      }
      return hw;
    });
  }
}
