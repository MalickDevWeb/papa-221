import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

let db: any;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });
    db = getFirestore(app, config.firestoreDatabaseId || undefined);
  } else {
    console.warn("firebase-applet-config.json not found, skipping backend Firebase init.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase on backend:", error);
}

export { db };

export async function getCollectionData(collectionName: string): Promise<any[]> {
  if (!db) return [];
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

export async function getDocData(collectionName: string, docId: string): Promise<any | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error(`Error fetching doc ${collectionName}/${docId}:`, error);
    return null;
  }
}

export async function saveDocData(collectionName: string, docId: string, data: any): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(`Error saving doc ${collectionName}/${docId}:`, error);
    throw error;
  }
}

export async function deleteDocData(collectionName: string, docId: string): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting doc ${collectionName}/${docId}:`, error);
    throw error;
  }
}
