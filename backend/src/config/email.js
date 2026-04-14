const nodemailer = require('nodemailer');

const EMAIL_FROM =
  process.env.EMAIL_FROM || 'ClipSphere <noreply@clipsphere.local>';

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  console.info('Ethereal email account created:');
  console.info(`  User: ${testAccount.user}`);
  console.info(`  Pass: ${testAccount.pass}`);

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
}

let transporterPromise;
function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = createTransporter();
  }
  return transporterPromise;
}

module.exports = { getTransporter, EMAIL_FROM };
