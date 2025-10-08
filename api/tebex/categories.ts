import { VercelRequest, VercelResponse } from '@vercel/node';

// Tebex Headless API
const TEBEX_API_BASE = "https://plugin.tebex.io";
const PROJECT_ID = "1620133"; // HavenRP Tebex project ID

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

  try {
    // Fetch categories from Tebex Headless API
    const response = await fetch(`${TEBEX_API_BASE}/categories?webstoreId=${PROJECT_ID}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
    console.error('Error fetching Tebex categories:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch categories',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
