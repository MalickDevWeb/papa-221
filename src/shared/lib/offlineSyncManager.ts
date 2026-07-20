export const OFFLINE_PREFIX = 'off_cache_';
export const QUEUE_KEY = 'off_mutations';

export interface QueuedMutation {
  id: string;
  url: string;
  method: string;
  body: string | null;
  headers: Record<string, string>;
}

export function saveToCache(url: string, data: any): void {
  try {
    localStorage.setItem(`${OFFLINE_PREFIX}${url}`, JSON.stringify(data));
  } catch (err) {
    console.warn('Cache write failed:', err);
  }
}

export function getFromCache(url: string): any | null {
  try {
    const val = localStorage.getItem(`${OFFLINE_PREFIX}${url}`);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function queueMutation(url: string, method: string, body: any, headers?: any): void {
  try {
    const queue: QueuedMutation[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    queue.push({
      id: Math.random().toString(36).substring(2),
      url,
      method,
      body: body ? JSON.stringify(body) : null,
      headers: headers || {}
    });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Queue mutation failed:', err);
  }
}

export async function syncOfflineMutations(): Promise<number> {
  const queue: QueuedMutation[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  if (queue.length === 0) return 0;

  let successCount = 0;
  const remaining: QueuedMutation[] = [];

  for (const item of queue) {
    try {
      const res = await window.fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          ...item.headers,
        },
        body: item.body
      });
      if (res.ok) {
        successCount++;
      } else {
        remaining.push(item);
      }
    } catch (err) {
      console.error('Failed to sync mutation:', item.url, err);
      remaining.push(item);
    }
  }

  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return successCount;
}
