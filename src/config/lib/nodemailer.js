import nodemailer from 'nodemailer';
import config from '##/src/config/config.js';

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.node_mailer.host,
      port: config.node_mailer.port,
      auth: {
        user: config.node_mailer.user,
        pass: config.node_mailer.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      // from: config.node_mailer.user,
      from: `"Team Career Explorer" <noreply@careerexplorer.me>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export { sendEmail };
