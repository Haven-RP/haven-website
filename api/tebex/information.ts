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

  // Use Secret Key (not Public Token) for Headless API
  const secretKey = process.env.TEBEX_SECRET_KEY || process.env.VITE_TEBEX_SECRET_KEY;

  if (!secretKey) {
    console.error('Environment variables:', Object.keys(process.env).filter(k => k.includes('TEBEX')));
    return res.status(500).json({ 
      error: 'Tebex secret key not configured. Please set TEBEX_SECRET_KEY in Vercel environment variables.' 
    });
  }

  try {
    // Fetch webstore info directly from the store URL
    const response = await fetch(`https://${secretKey}.tebex.io/api/information`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://${secretKey}.tebex.io`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tebex API error: ${response.status}`, errorText);
      throw new Error(`Tebex API returned ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=600'); // Cache for 10 minutes
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching Tebex information:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch store information',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

