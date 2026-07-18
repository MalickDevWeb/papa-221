import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  eTag: string;
  expiresAt: number;
}

export class MobileCacheManager {
  private static cache = new Map<string, CacheEntry>();

  public static get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry;
  }

  public static set(key: string, data: any, ttlMs: number = 30000): string {
    const eTag = `W/"${Buffer.from(JSON.stringify(data)).toString('base64').substring(0, 16)}"`;
    this.cache.set(key, {
      data,
      eTag,
      expiresAt: Date.now() + ttlMs,
    });
    return eTag;
  }

  public static invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  public static middleware(ttlMs: number = 15000) {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        // Invalidate cache for mutations on the resource
        const resource = req.path.split('/')[2];
        if (resource) {
          MobileCacheManager.invalidatePattern(resource);
        }
        next();
        return;
      }

      const cacheKey = req.originalUrl || req.url;
      const cached = MobileCacheManager.get(cacheKey);

      if (cached) {
        const clientETag = req.headers['if-none-match'];
        if (clientETag === cached.eTag) {
          res.status(304).end();
          return;
        }
        res.setHeader('ETag', cached.eTag);
        res.setHeader('X-Cache', 'HIT - Mobile Optimized');
        res.json(cached.data);
        return;
      }

      // Override res.json to capture response
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        const eTag = MobileCacheManager.set(cacheKey, body, ttlMs);
        res.setHeader('ETag', eTag);
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    };
  }
}
