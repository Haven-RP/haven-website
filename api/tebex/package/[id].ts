import { VercelRequest, VercelResponse } from '@vercel/node';

// Use Headless API for web storefronts  
const TEBEX_BASE_URL = "https://headless.tebex.io/api";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Package ID is required' });
  }

  // Use Secret Key (not Public Token) for Headless API
  const secretKey = process.env.TEBEX_SECRET_KEY || process.env.VITE_TEBEX_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ 
      error: 'Tebex secret key not configured. Please set TEBEX_SECRET_KEY in Vercel environment variables.' 
    });
  }

  try {
    const response = await fetch(`${TEBEX_BASE_URL}/accounts/${secretKey}/packages/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tebex API error: ${response.status}`, errorText);
      throw new Error(`Tebex API returned ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=300'); // Cache for 5 minutes
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching Tebex package:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch package',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

