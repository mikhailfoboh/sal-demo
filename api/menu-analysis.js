// Server-side Perplexity API proxy to bypass CORS restrictions
module.exports = async function handler(req, res) {
  try {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests for the actual API call
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { restaurantInfo } = req.body || {};

    if (!restaurantInfo || !restaurantInfo.name) {
      return res.status(400).json({ error: 'Restaurant info with name is required' });
    }

    console.log(`🔍 Server-side menu analysis for: ${restaurantInfo.name}`);

    // For now, return mock data to test basic functionality
    const mockMenuData = {
      dishes: [
        { name: "Grilled Salmon", price: "$28.50", category: "Main Course" },
        { name: "Caesar Salad", price: "$16.50", category: "Salads" },
        { name: "Fish & Chips", price: "$24.90", category: "Main Course" }
      ],
      confidence: 'high',
      source: 'Mock Data',
      sourceUrl: 'https://example.com',
      lastUpdated: new Date().toISOString()
    };

    console.log(`✅ Returning mock menu data with ${mockMenuData.dishes.length} items`);
    return res.status(200).json(mockMenuData);

  } catch (error) {
    console.error('❌ Server-side menu analysis failed:', error);
    // Ensure CORS headers are set even for server errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Menu analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
