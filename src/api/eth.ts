import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Proxy endpoint for Ethereum RPC requests
router.post('/eth', async (req, res) => {
  try {
    const alchemyUrl = process.env.VITE_RPC_URL;
    
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Ethereum RPC proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 