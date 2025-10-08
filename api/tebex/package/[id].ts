import { VercelRequest, VercelResponse } from '@vercel/node';

const TEBEX_BASE_URL = "https://plugin.tebex.io";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Package ID is required' });
  }

  const token = process.env.VITE_TEBEX_PUBLIC_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Tebex token not configured' });
  }

  try {
    const response = await fetch(`${TEBEX_BASE_URL}/packages/${id}`, {
      headers: {
        'X-Tebex-Public-Token': token,
      },
    });

    if (!response.ok) {
      throw new Error(`Tebex API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=300'); // Cache for 5 minutes
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching Tebex package:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch package' });
  }
}

