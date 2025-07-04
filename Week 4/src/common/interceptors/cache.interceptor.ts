import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);
  private readonly TTL = 300; // 5 minutes in seconds
  private readonly cacheEnabled: boolean;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService
  ) {
    // Check if Redis is disabled
    this.cacheEnabled = this.configService.get('DISABLE_REDIS') !== 'true';
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Skip caching for non-GET requests
    if (context.switchToHttp().getRequest().method !== 'GET') {
      return next.handle();
    }

    // Skip caching if Redis is disabled
    if (!this.cacheEnabled) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = `cache:${request.url}`;

    try {
      // Try to get from cache
      const cachedData = await this.redis.get(cacheKey);
      
      if (cachedData) {
        // Cache hit
        return of(JSON.parse(cachedData));
      }

      // Cache miss, get data and store in cache
      return next.handle().pipe(
        tap(async (data) => {
          try {
            await this.redis.set(cacheKey, JSON.stringify(data), 'EX', this.TTL);
          } catch (error) {
            // Silently fail on cache set errors
          }
        })
      );
    } catch (error) {
      // Any Redis error, just continue without caching
      return next.handle();
    }
  }
}