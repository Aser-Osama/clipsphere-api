const nodemailer = require('nodemailer');
const { getTransporter, EMAIL_FROM } = require('../config/email');
const User = require('../models/User');

const isDev = process.env.NODE_ENV !== 'production';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
  );
}

function wrapHtml(title, body) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#6c63ff;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;">ClipSphere</h1>
        </td></tr>
        <tr><td style="padding:32px 24px;">${body}</td></tr>
        <tr><td style="padding:16px 24px;text-align:center;color:#999;font-size:12px;">
          &copy; ${new Date().getFullYear()} ClipSphere. All rights reserved.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

exports.sendWelcomeEmail = async (user) => {
  try {
    const transporter = await getTransporter();
    const html = wrapHtml(
      'Welcome to ClipSphere!',
      `<h2 style="margin:0 0 16px;color:#333;">Welcome, ${escapeHtml(user.username)}!</h2>
       <p style="color:#555;line-height:1.6;">
         Thanks for joining ClipSphere. Start exploring, uploading, and sharing amazing videos with the community.
       </p>
       <p style="margin:24px 0;text-align:center;">
         <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}"
            style="background:#6c63ff;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
           Get Started
         </a>
       </p>`
    );

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to ClipSphere!',
      html
    });

    if (isDev) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.info('Welcome email preview:', previewUrl);
    }
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
};

const engagementSubjects = {
  follower: 'You have a new follower on ClipSphere!',
  comment: 'Someone commented on your video!',
  like: 'Someone liked your video!'
};

function buildEngagementBody(actorName, type, meta) {
  const videoLink = meta?.videoId
    ? `<a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/video/${meta.videoId}" style="color:#6c63ff;">View video</a>`
    : '';

  const safe = escapeHtml(actorName);
  switch (type) {
    case 'follower':
      return `<p style="color:#555;line-height:1.6;"><strong>${safe}</strong> started following you.</p>`;
    case 'comment':
      return `<p style="color:#555;line-height:1.6;"><strong>${safe}</strong> commented on your video.</p>${videoLink}`;
    case 'like':
      return `<p style="color:#555;line-height:1.6;"><strong>${safe}</strong> liked your video.</p>${videoLink}`;
    default:
      return `<p style="color:#555;line-height:1.6;">You have a new notification from <strong>${safe}</strong>.</p>`;
  }
}

exports.sendEngagementEmail = async (recipient, actorId, type, meta) => {
  try {
    const transporter = await getTransporter();

    let actorName = 'A ClipSphere user';
    try {
      const actor = await User.findById(actorId).select('username').lean();
      if (actor?.username) actorName = actor.username;
    } catch (_) {
      // keep default actorName
    }

    const subject = engagementSubjects[type] || 'New notification from ClipSphere';
    const body = buildEngagementBody(actorName, type, meta);
    const html = wrapHtml(subject, body);

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipient.email,
      subject,
      html
    });

    if (isDev) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.info('Engagement email preview:', previewUrl);
    }
  } catch (err) {
    console.error('Failed to send engagement email:', err.message);
  }
};
