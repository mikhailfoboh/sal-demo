// Simple test version of menu-analysis
module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(200).json({ 
      message: 'Menu analysis endpoint is working!',
      method: req.method,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in menu-analysis handler:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}