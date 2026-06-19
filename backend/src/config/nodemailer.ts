import nodemailer from 'nodemailer';
import config from './config';

export const transporter = nodemailer.createTransport({
  service: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASSWORD!
  },
  connectionTimeout: 10000,
});
