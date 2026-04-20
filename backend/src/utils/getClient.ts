 
import {Redis} from 'ioredis';

let redisInstance: Redis | null = null;

export const getClient = (): Redis => {
  if (!redisInstance) {
    
    redisInstance = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
       
      connectTimeout: 10000, 
      retryStrategy: (times:number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisInstance.on('error', (err:Error) => {
      console.error('Redis_Connection_Error:', err);
    });

    redisInstance.on('connect', () => {
      console.log('Successfully_Connected_to_Redis_Kernel');
    });
  }

  return redisInstance;
};