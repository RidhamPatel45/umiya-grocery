import Redis from 'ioredis';
import logger from '../utils/logger';

let redis: Redis;

export const connectRedis = async (): Promise<void> => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
  redis.on('connect', () => logger.info('✅ Redis connected'));
  redis.on('error', (err: Error) => logger.warn('⚠️ Redis:', err.message));
  try { await redis.connect(); } catch { /* continue without cache */ }
};

export const cacheGet = async (key: string): Promise<string | null> => {
  try { return await redis?.get(key); } catch { return null; }
};

export const cacheSet = async (key: string, value: string, ttl = 300): Promise<void> => {
  try { await redis?.setex(key, ttl, value); } catch { /* silent */ }
};

export const cacheDel = async (key: string): Promise<void> => {
  try { await redis?.del(key); } catch { /* silent */ }
};
