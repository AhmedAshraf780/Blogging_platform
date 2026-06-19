import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT as number | undefined || 5000,
  mail_user: process.env.MAIL_USER as string,
  mail_password: process.env.MAIL_PASSWORD as string,
  database_url: process.env.DATABASE_URL as string,
  redis_url: process.env.REDIS_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
  auth_token: process.env.AUTH_TOKEN as string,
};

export default config;
