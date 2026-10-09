require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Passcode verification endpoints using environment variables
app.post('/api/verify-front', (req, res) => {
  const { code } = req.body;
  const correctCode = process.env.FRONT_PASSCODE || 'RPHMEGSHQWXGMEFEGA';
  
  if (code && code.trim().toUpperCase() === correctCode) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'ACCESS DENIED' });
});

app.post('/api/verify-terminal', (req, res) => {
  const { terminal, code } = req.body;
  const westCode = process.env.WEST_PASSCODE || 'UNHEARD';
  const eastCode = process.env.EAST_PASSCODE || 'STAY';
  const docUrl = process.env.DOC_URL || 'https://docs.google.com/document/d/1jVw80_R77SRuha4BK_D-qeaVF4zRlTFRtAO7QhnCK_c/edit?usp=sharing';

  const cleanCode = (code || '').trim().toUpperCase();

  if (terminal === 'west' && cleanCode === westCode) {
    return res.json({ success: true, url: docUrl });
  } else if (terminal === 'east' && cleanCode === eastCode) {
    return res.json({ success: true, url: docUrl });
  }

  return res.status(401).json({ success: false, message: 'TERMINAL LOCKED - ACCESS DENIED' });
});

app.listen(PORT, () => {
  console.log(`[NF FOUNDATION ARCHIVE] Server running on port ${PORT}`);
});