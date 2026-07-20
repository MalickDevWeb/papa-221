import { AxiosInstance } from 'axios';
import { saveToCache, getFromCache, queueMutation } from './offlineSyncManager';

export function setupOfflineInterceptors(apiClient: AxiosInstance): void {
  // Axios response interceptor for offline caching & fallback
  apiClient.interceptors.response.use(
    (response) => {
      const { config, data } = response;
      if (config.method === 'get' || config.method === 'GET') {
        saveToCache(config.url || '', data);
      }
      return response;
    },
    async (error) => {
      const config = error.config;
      if (!navigator.onLine || error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        if (config && (config.method === 'get' || config.method === 'GET')) {
          const cached = getFromCache(config.url || '');
          if (cached) {
            return { ...error, data: cached, status: 200, statusText: 'OK', headers: {}, config };
          }
        } else if (config && config.method && config.method !== 'get' && config.method !== 'GET') {
          queueMutation(config.url || '', config.method, config.data, config.headers);
          return Promise.reject(new Error("Vous êtes hors-ligne. Votre action a été mise en attente."));
        }
      }
      return Promise.reject(error);
    }
  );

  // Global window.fetch override safely wrapped
  try {
    const originalFetch = window.fetch;
    const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const urlStr = typeof input === 'string' ? input : (input as any).url || String(input);
      const method = init?.method || 'GET';
      const isGet = method.toUpperCase() === 'GET';

      if (!navigator.onLine) {
        if (isGet) {
          const cached = getFromCache(urlStr);
          if (cached) {
            return new Response(JSON.stringify(cached), {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else {
          queueMutation(urlStr, method, init?.body);
          throw new Error("Vous êtes hors-ligne. Action mise en attente.");
        }
      }

      try {
        const response = await originalFetch(input, init);
        if (response.ok && isGet) {
          try {
            const cloned = response.clone();
            const json = await cloned.json();
            saveToCache(urlStr, json);
          } catch {
            // Ignore non-JSON
          }
        }
        return response;
      } catch (err) {
        if (isGet) {
          const cached = getFromCache(urlStr);
          if (cached) {
            return new Response(JSON.stringify(cached), {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        throw err;
      }
    };

    try {
      (window as any).fetch = customFetch;
    } catch {
      Object.defineProperty(window, 'fetch', {
        value: customFetch,
        writable: true,
        configurable: true
      });
    }
  } catch (err) {
    console.warn('Could not override window.fetch for offline caching:', err);
  }
}
