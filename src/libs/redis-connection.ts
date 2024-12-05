import { Redis } from 'ioredis'
import logger from '@libs/logger'
import { config } from '@configs/index'

const radisUrl = config().redis.url as string;

 // Create a redis connection singleton
export const connection = new Redis(radisUrl, {
   maxRetriesPerRequest: null
 });

connection.on('connect', () => {
   logger.info('Connected to Redis');
});

connection.on('error', (error: any) => {
   logger.error('Error connecting to Redis', error);
});

connection.on('close', () => {
   logger.warn('Redis connection closed')
})

connection.on('reconnecting', (delay: number) => {
   logger.info(`Reconnecting ti Redis in ${delay}ms`);
})
