import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  origin: process.env.ORIGIN,
  redisurl: process.env.REDIS_URL,
  jwt_secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRE,
  refresh_token: process.env.REFRESH_TOKEN,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE,
  cloudinary: {
    cloudname: process.env.CLOUD_NAME,
    cloudapikey: process.env.CLOUD_API_KEY,
    cloudsecretkey: process.env.CLOUD_SECRET_KEY,
  },
  smtp: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpService: process.env.SMTP_SERVICE,
    smtpMail: process.env.SMTP_MAIL,
    smtpPassword: process.env.SMTP_PASSWORD,
  },
};
