/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import config from '../config';

type EmailOptions = {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
};

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: config.smtp.smtpHost,
    port: parseInt(config.smtp.smtpPort || '587'),
    service: config.smtp.smtpService,
    auth: {
      user: config.smtp.smtpMail,
      pass: config.smtp.smtpPassword,
    },
  });

  const { email, subject, template, data } = options;

  // ** get the path to the email template file
  const templatePath = path.join(__dirname, '../mails/', template);

  // ** Render the email templeate with Ejs
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: '',
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendMail;
