import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// Create a mock Redis client for when Redis is not available
class MockRedisClient {
  private logger = new Logger('MockRedisClient');
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  // Add any other methods you need to mock
  on(event: string, callback: Function): void {
    // Do nothing for events
  }

  disconnect(): void {
    // Do nothing
  }
}

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisProvider');
    const redisUrl = configService.get('REDIS_URL');
    
    // Check if Redis is disabled
    const disableRedis = configService.get('DISABLE_REDIS') === 'true';
    if (disableRedis) {
      logger.log('Redis is disabled by configuration. Using mock Redis client.');
      return new MockRedisClient();
    }
    
    try {
      // Try to connect to Redis with limited retries
      const client = new Redis(redisUrl, {
        retryStrategy: (times) => {
          // Only retry a few times to avoid flooding logs
          if (times > 3) {
            logger.warn('Max Redis connection attempts reached. Using mock Redis client.');
            return null; // Stop retrying
          }
          const delay = Math.min(times * 100, 3000);
          return delay;
        },
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        connectTimeout: 5000,
        lazyConnect: true, // Don't connect immediately
      });
      
      // Handle connection errors silently after initial attempts
      let errorLogged = false;
      client.on('error', (err) => {
        if (!errorLogged) {
          logger.warn(`Redis connection failed: ${err.message}. Caching will be disabled.`);
          errorLogged = true;
        }
      });
      
      client.on('connect', () => {
        logger.log('Successfully connected to Redis');
        errorLogged = false;
      });
      
      // Try to connect, but fall back to mock if it fails
      client.connect().catch(() => {
        logger.warn('Could not connect to Redis. Using mock Redis client.');
      });
      
      return client;
    } catch (error) {
      logger.warn(`Redis initialization failed: ${error.message}. Using mock Redis client.`);
      return new MockRedisClient();
    }
  },
  inject: [ConfigService],
};

@Module({
  providers: [RedisProvider],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}