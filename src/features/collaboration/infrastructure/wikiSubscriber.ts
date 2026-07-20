import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
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

export function subscribeWikis(onUpdate: (wikis: readonly WikiPage[]) => void) {
  const colRef = collection(db, COLL_WIKIS);
  return onSnapshot(colRef, async (snapshot) => {
    try {
      if (snapshot.empty) {
        await setDoc(doc(db, COLL_WIKIS, DEFAULT_WIKI.id), DEFAULT_WIKI);
        return;
      }
      const wikis: WikiPage[] = [];
      snapshot.forEach((docSnap) => wikis.push(docSnap.data() as WikiPage));
      saveLocalItems(KEYS.WIKIS, wikis);
      onUpdate(wikis);
    } catch (err) {
      console.error('Failed to parse or seed wiki', err);
    }
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, COLL_WIKIS);
    } catch (loggedErr) {
      console.warn('Firestore wiki subscription failed, falling back to local cache:', loggedErr);
      onUpdate(getLocalItems<WikiPage>(KEYS.WIKIS, [DEFAULT_WIKI]));
    }
  });
}

export function subscribeNotes(onUpdate: (notes: readonly CollabNote[]) => void) {
  const colRef = collection(db, COLL_NOTES);
  return onSnapshot(colRef, async (snapshot) => {
    try {
      if (snapshot.empty) {
        await setDoc(doc(db, COLL_NOTES, DEFAULT_NOTE.id), DEFAULT_NOTE);
        return;
      }
      const notes: CollabNote[] = [];
      snapshot.forEach((docSnap) => notes.push(docSnap.data() as CollabNote));
      saveLocalItems(KEYS.NOTES, notes);
      onUpdate(notes);
    } catch (err) {
      console.error('Failed to parse or seed notes', err);
    }
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, COLL_NOTES);
    } catch (loggedErr) {
      console.warn('Firestore notes subscription failed, falling back to local cache:', loggedErr);
      onUpdate(getLocalItems<CollabNote>(KEYS.NOTES, [DEFAULT_NOTE]));
    }
  });
}

export function subscribeAudits(onUpdate: (audits: readonly AuditLog[]) => void) {
  const colRef = collection(db, COLL_AUDITS);
  return onSnapshot(colRef, async (snapshot) => {
    try {
      if (snapshot.empty) {
        await setDoc(doc(db, COLL_AUDITS, DEFAULT_AUDIT.id), DEFAULT_AUDIT);
        return;
      }
      const audits: AuditLog[] = [];
      snapshot.forEach((docSnap) => audits.push(docSnap.data() as AuditLog));
      saveLocalItems(KEYS.AUDITS, audits);
      onUpdate(audits);
    } catch (err) {
      console.error('Failed to parse or seed audits', err);
    }
  }, (err) => {
    try {
      handleFirestoreError(err, OperationType.LIST, COLL_AUDITS);
    } catch (loggedErr) {
      console.warn('Firestore audits subscription failed, falling back to local cache:', loggedErr);
      onUpdate(getLocalItems<AuditLog>(KEYS.AUDITS, [DEFAULT_AUDIT]));
    }
  });
}
