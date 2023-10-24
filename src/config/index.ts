import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  origin: process.env.ORIGIN,
  redisurl: process.env.REDIS_URL,
  jwt_secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
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
