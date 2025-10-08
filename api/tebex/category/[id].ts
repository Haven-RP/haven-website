import { VercelRequest, VercelResponse } from '@vercel/node';

const TEBEX_BASE_URL = "https://plugin.tebex.io";

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
    return res.status(400).json({ error: 'Category ID is required' });
  }

  // Try both with and without VITE_ prefix
  const token = process.env.TEBEX_PUBLIC_TOKEN || process.env.VITE_TEBEX_PUBLIC_TOKEN;

  if (!token) {
    return res.status(500).json({ 
      error: 'Tebex token not configured. Please set TEBEX_PUBLIC_TOKEN or VITE_TEBEX_PUBLIC_TOKEN in Vercel environment variables.' 
    });
  }

  try {
    const response = await fetch(`${TEBEX_BASE_URL}/categories/${id}`, {
      headers: {
        'X-Tebex-Public-Token': token,
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
    console.error('Error fetching Tebex category packages:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch category packages',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

