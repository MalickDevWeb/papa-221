export type HomeworkPriority = 'haute' | 'normale';
export type HomeworkStatus = 'a_faire' | 'en_cours' | 'soumis';

export interface Homework {
  readonly id: string;
  readonly titre: string;
  readonly cours: string;
  readonly coursLabel: string;
  readonly desc: string;
  readonly prio: HomeworkPriority;
  readonly statut: HomeworkStatus;
  readonly deadlineStr: string;
  readonly progress?: number;
  readonly note?: string;
  readonly attente?: boolean;
}

export interface CreateHomeworkCommand {
  readonly titre: string;
  readonly cours: string;
  readonly desc: string;
  readonly prio: HomeworkPriority;
}

/**
 * Factory pur pour créer un nouveau devoir
 */
export function createHomework(cmd: CreateHomeworkCommand): Homework {
  if (!cmd.titre.trim()) throw new Error("Le titre du devoir est obligatoire");
  if (!cmd.desc.trim()) throw new Error("La description est obligatoire");

  return {
    id: `hw_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    titre: cmd.titre,
    cours: cmd.cours,
    // On déduit un label court (règle métier simple pour l'UI)
    coursLabel: cmd.cours.split(' ')[0],
    desc: cmd.desc,
    prio: cmd.prio,
    statut: 'a_faire',
    deadlineStr: 'Dans 7 jours', // Valeur par défaut
  };
}
