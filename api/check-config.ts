import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key exists (without exposing it)
    const hasApiKey = !!apiKey;
    const apiKeyLength = apiKey ? apiKey.length : 0;
    const apiKeyPrefix = apiKey ? apiKey.substring(0, 10) + '...' : 'Not set';
    
    return res.status(200).json({
      status: hasApiKey ? 'configured' : 'missing',
      apiKeyExists: hasApiKey,
      apiKeyLength: hasApiKey ? apiKeyLength : 0,
      apiKeyPrefix: hasApiKey ? apiKeyPrefix : null,
      message: hasApiKey 
        ? 'API key is configured correctly' 
        : 'API key is missing. Please set GEMINI_API_KEY in Vercel Environment Variables.',
      environment: process.env.NODE_ENV || 'production'
    });
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Failed to check configuration',
      details: error.message 
    });
  }
}

