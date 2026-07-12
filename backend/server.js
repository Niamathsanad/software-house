require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure the data folder/file exist so contact.js can read/write safely
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'submissions.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf-8');

// CORS — allow the frontend origin(s) set in .env
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins
}));
app.use(express.json());

// API routes
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Nexora backend running at http://localhost:${PORT}`);
  console.log(`Health check:            http://localhost:${PORT}/api/health`);
  console.log(`Contact submissions:     http://localhost:${PORT}/api/contact`);
});
