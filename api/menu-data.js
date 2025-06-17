module.exports = async function handler(req, res) {
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

  const { restaurantInfo } = req.body || {};
  
  return res.status(200).json({ 
    message: 'Menu analysis working!',
    restaurant: restaurantInfo?.name || 'Unknown',
    mockData: {
      dishes: [
        { name: "Grilled Salmon", price: "$28.50" },
        { name: "Caesar Salad", price: "$16.50" }
      ],
      confidence: 'high'
    },
    timestamp: new Date().toISOString()
  });
}