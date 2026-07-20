import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAUidN9fetDArpGdFZjPBH0gJRUv_orsvE",
  authDomain: "gen-lang-client-0410256230.firebaseapp.com",
  projectId: "gen-lang-client-0410256230",
  storageBucket: "gen-lang-client-0410256230.firebasestorage.app",
  messagingSenderId: "412698237242",
  appId: "1:412698237242:web:5bac623f321d7997f29803"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: true,
}, "ai-studio-cole221-19e1ef57-ebb1-4eb2-820c-71d01f79804b");
export const auth = getAuth(app);
