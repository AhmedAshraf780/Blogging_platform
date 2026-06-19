import nodemailer from 'nodemailer';
import config from './config';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: config.mail_user,
    pass: config.mail_password
  },
  connectionTimeout: 10000,
});
