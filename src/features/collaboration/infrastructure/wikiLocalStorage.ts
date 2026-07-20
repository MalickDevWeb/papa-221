import { WikiPage, CollabNote, AuditLog } from '../domain/TaskWikiModels';

export const COLL_WIKIS = 'collab_wikis';
export const COLL_NOTES = 'collab_notes';
export const COLL_AUDITS = 'collab_audits';

export const DEFAULT_WIKI: WikiPage = {
  id: 'wiki-1',
  groupId: 'group-1',
  title: 'Architecture Globale',
  content: "Cette section décrit les couches logicielles du projet, structurées selon l'architecture hexagonale.",
  author: 'Fatou Sow',
  updatedAt: '18/07/2026',
};

export const DEFAULT_NOTE: CollabNote = {
  id: 'note-1',
  groupId: 'group-1',
  title: "Idées d'algorithmes",
  content: 'Penser à tester les CNN pour la classification initiale des radios.',
  isPrivate: false,
  authorId: 'stud-2',
  authorName: 'Fatou Sow',
};

export const DEFAULT_AUDIT: AuditLog = {
  id: 'log-1',
  groupId: 'group-1',
  timestamp: '18/07/2026 09:12:00',
  userName: 'Fatou Sow',
  action: "Connexion à l'espace de travail collaboratif",
  ipAddress: '192.168.1.42',
};

export const KEYS = {
  WIKIS: 'local_collab_wikis',
  NOTES: 'local_collab_notes',
  AUDITS: 'local_collab_audits'
};

export function getLocalItems<T>(key: string, defaultValue: T[]): T[] {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveLocalItems<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
}
