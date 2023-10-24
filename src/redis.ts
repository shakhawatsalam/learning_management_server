import { Redis } from 'ioredis';
import config from './config';

const redisClient = () => {
  if (config.redisurl) {
    console.log(`Redis Connected 🚀🚀🚀`);
    return config.redisurl;
  }
  throw new Error(`Redis Connection Failed`);
};

export const redis = new Redis(redisClient());
