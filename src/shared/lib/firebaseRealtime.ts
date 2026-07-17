// Firebase Realtime Database client-side SDK simulation
import { apiClient } from '@/shared/lib/apiClient';

type Callback = (snapshot: { val: () => any }) => void;
const listeners: Record<string, Set<Callback>> = {};

let isPolling = false;
let lastStateStr: string | null = null;

async function pollState() {
  try {
    // In a real Firebase RTDB, this would be a WebSocket listener.
    // We simulate this real-time sync with high-frequency HTTP polling.
    const res = await apiClient.get('/student/live-sessions');
    const sessions = Array.isArray(res.data) ? res.data : [];
    const active = sessions.find((s: any) => s && s.status === 'active') || null;
    
    const stateStr = JSON.stringify(active);
    if (stateStr !== lastStateStr) {
      lastStateStr = stateStr;
      notifyListeners('meet/active', active);
    }
  } catch (err) {
    console.warn("Firebase Realtime DB sync error:", err);
  }
}

function notifyListeners(path: string, val: any) {
  const pathListeners = listeners[path];
  if (pathListeners) {
    pathListeners.forEach(cb => {
      try {
        cb({ val: () => val });
      } catch (err) {
        console.error("Error in Firebase Realtime DB listener callback:", err);
      }
    });
  }
}

export function getDatabase() {
  if (!isPolling && typeof window !== 'undefined') {
    isPolling = true;
    pollState();
    // Low-frequency polling to prevent 429 rate limits (every 10 seconds)
    setInterval(pollState, 10000);
  }
  return { name: "FirebaseRealtimeDatabase" };
}

export function ref(db: any, path: string) {
  return { db, path };
}

export function onValue(reference: { path: string }, callback: Callback) {
  const { path } = reference;
  if (!listeners[path]) {
    listeners[path] = new Set();
  }
  listeners[path].add(callback);

  // If we already have a synced state, send it immediately
  if (path === 'meet/active' && lastStateStr !== null) {
    const val = JSON.parse(lastStateStr);
    callback({ val: () => val });
  } else {
    pollState();
  }

  // Return unsubscribe cleanup function
  return () => {
    listeners[path]?.delete(callback);
  };
}

export async function set(reference: { path: string }, value: any) {
  // Simulates pushing state to the Firebase cloud server
  if (reference.path === 'meet/active') {
    notifyListeners(reference.path, value);
  }
}
