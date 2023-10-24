import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  origin: process.env.ORIGIN,
  redisurl: process.env.REDIS_URL,
  cloudinary: {
    cloudname: process.env.CLOUD_NAME,
    cloudapikey: process.env.CLOUD_API_KEY,
    cloudsecretkey: process.env.CLOUD_SECRET_KEY,
  },
};
