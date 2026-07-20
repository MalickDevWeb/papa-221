import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase';
import { WikiPage, CollabNote, AuditLog } from '../domain/TaskWikiModels';
import { handleFirestoreError, OperationType } from './collabError';
import {
  COLL_WIKIS,
  COLL_NOTES,
  COLL_AUDITS,
  DEFAULT_WIKI,
  DEFAULT_NOTE,
  DEFAULT_AUDIT,
  KEYS,
  getLocalItems,
  saveLocalItems
} from './wikiLocalStorage';

export async function saveWiki(w: WikiPage): Promise<void> {
  const current = getLocalItems<WikiPage>(KEYS.WIKIS, [DEFAULT_WIKI]);
  const next = current.filter(x => x.id !== w.id).concat(w);
  saveLocalItems(KEYS.WIKIS, next);
  try {
    await setDoc(doc(db, COLL_WIKIS, w.id), w);
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.WRITE, `${COLL_WIKIS}/${w.id}`);
    } catch (loggedErr) {
      console.warn('Firestore wiki write failed, local cache preserved:', loggedErr);
    }
  }
}

export async function saveNote(n: CollabNote): Promise<void> {
  const current = getLocalItems<CollabNote>(KEYS.NOTES, [DEFAULT_NOTE]);
  const next = current.filter(x => x.id !== n.id).concat(n);
  saveLocalItems(KEYS.NOTES, next);
  try {
    await setDoc(doc(db, COLL_NOTES, n.id), n);
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.WRITE, `${COLL_NOTES}/${n.id}`);
    } catch (loggedErr) {
      console.warn('Firestore note write failed, local cache preserved:', loggedErr);
    }
  }
}

export async function saveAudit(a: AuditLog): Promise<void> {
  const current = getLocalItems<AuditLog>(KEYS.AUDITS, [DEFAULT_AUDIT]);
  const next = current.filter(x => x.id !== a.id).concat(a);
  saveLocalItems(KEYS.AUDITS, next);
  try {
    await setDoc(doc(db, COLL_AUDITS, a.id), a);
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.WRITE, `${COLL_AUDITS}/${a.id}`);
    } catch (loggedErr) {
      console.warn('Firestore audit write failed, local cache preserved:', loggedErr);
    }
  }
}
