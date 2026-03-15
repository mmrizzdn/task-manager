import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidateByPrefix(prefix: string) {
    try {
      const stores = this.cacheManager.stores as any;
      const keysToDelete: string[] = [];

      if (Array.isArray(stores)) {
        for (const store of stores) {
          if (typeof store.keys === 'function') {
            try {
              const allKeys = await store.keys('*');
              if (allKeys && Array.isArray(allKeys)) {
                const matchingKeys = allKeys.filter((key: string) => key.startsWith(prefix));
                keysToDelete.push(...matchingKeys);
              }
            } catch (e) {
              console.warn(`Error getting keys from store:`, e);
            }
          }
        }
      } else if (typeof stores?.keys === 'function') {
        try {
          const allKeys = await stores.keys('*');
          if (allKeys && Array.isArray(allKeys)) {
            const matchingKeys = allKeys.filter((key: string) => key.startsWith(prefix));
            keysToDelete.push(...matchingKeys);
          }
        } catch (e) {
          console.warn(`Error getting keys from cache:`, e);
        }
      }

      if (keysToDelete.length > 0) {
        await Promise.all(keysToDelete.map((key: string) => this.cacheManager.del(key)));
      } else {
      }
    } catch (error) {
      console.error(`Error invalidating cache with prefix ${prefix}:`, error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);
    return value !== undefined ? value : null;
  }

  async set(key: string, value: any, ttl = 60 * 1000) {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
