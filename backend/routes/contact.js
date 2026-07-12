const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'submissions.json');

function readSubmissions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read submissions file:', err);
    return [];
  }
}

function writeSubmissions(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

async function sendEmailNotification(submission) {
  const recipient = process.env.CONTACT_EMAIL || 'niamatullahsafi594@gmail.com';
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(`Email not sent. SMTP not configured. Would notify ${recipient}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || smtpUser,
    to: recipient,
    subject: `New project inquiry from ${submission.name}`,
    text: `Name: ${submission.name}\nEmail: ${submission.email}\n\nMessage:\n${submission.details}`
  };

  await transporter.sendMail(mailOptions);
}

// POST /api/contact — receive a lead from the contact form
router.post('/', async (req, res) => {
  const { name, email, details, consent } = req.body || {};

  if (!name || !email || !details) {
    return res.status(400).json({ error: 'name, email, and details are all required.' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'consent is required to submit this form.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'please provide a valid email address.' });
  }

  const submission = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    details: String(details).slice(0, 5000),
    consent: !!consent,
    receivedAt: new Date().toISOString()
  };

  const list = readSubmissions();
  list.push(submission);
  writeSubmissions(list);

  try {
    await sendEmailNotification(submission);
  } catch (err) {
    console.error('Email delivery failed:', err);
  }

  return res.status(201).json({ message: 'Submission received.', id: submission.id });
});

// GET /api/contact — list submissions (simple admin view, no auth — add auth before real use)
router.get('/', (req, res) => {
  const list = readSubmissions();
  return res.json({ count: list.length, submissions: list });
});

module.exports = router;
