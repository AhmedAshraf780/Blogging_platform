import nodemailer from 'nodemailer';
import config from './config';

export const transporter = nodemailer.createTransport({
  service: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.mail_user,
    pass: config.mail_password
  },
  connectionTimeout: 10000,
});
