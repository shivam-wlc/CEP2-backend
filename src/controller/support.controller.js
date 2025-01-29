// sending supports emails
import { sendEmail } from '../config/lib/nodemailer.js';
import config from '##/src/config/config.js';

async function sendAdminSupportEmail(req, res) {
  const { firstName, lastName, email, phoneNumber, query } = req.body;

  // Prepare HTML content for the email
  const emailContent = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Message:</strong> ${query}</p>
    `;

  try {
    // Sending email using the sendEmail function
    await sendEmail(
      config.node_mailer.user,
      `New Contact Form Submission from ${firstName} ${lastName}`,
      emailContent,
    );

    // Respond with success
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send(`Failed to send email: ${error.message}`);
  }
}

async function sendTechSupportEmail(req, res) {
  const { firstName, lastName, email, phoneNumber, query } = req.body;

  // Prepare HTML content for the email
  const emailContent = `
      <h1>New Tech Support Contact Form Submission</h1>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Message:</strong> ${query}</p>
    `;

  try {
    // Sending email using the sendEmail function to the tech support email
    await sendEmail(
      'tech@careerexplorer.me', // Tech support email
      `New Tech Support Contact Form Submission from ${firstName} ${lastName}`,
      emailContent,
    );

    // Respond with success
    res.status(200).send('Email sent to Tech Support successfully!');
  } catch (error) {
    console.error('Error sending email to Tech Support:', error);
    res.status(500).send(`Failed to send email to Tech Support: ${error.message}`);
  }
}

async function sendStudentSupportEmail(req, res) {
  const { firstName, lastName, email, phoneNumber, query } = req.body;

  // Prepare HTML content for the email
  const emailContent = `
      <h1>New Student Support Contact Form Submission</h1>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Message:</strong> ${query}</p>
    `;

  try {
    // Sending email using the sendEmail function to the student support email
    await sendEmail(
      'hello@careerexplorer.me', // Student support email
      `New Student Support Contact Form Submission from ${firstName} ${lastName}`,
      emailContent,
    );

    // Respond with success
    res.status(200).send('Email sent to Student Support successfully!');
  } catch (error) {
    console.error('Error sending email to Student Support:', error);
    res.status(500).send(`Failed to send email to Student Support: ${error.message}`);
  }
}

export { sendAdminSupportEmail, sendStudentSupportEmail, sendTechSupportEmail };
