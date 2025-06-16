import { VercelRequest, VercelResponse } from '@vercel/node';

interface RestaurantInfo {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  cuisineType?: string;
  priceLevel?: number;
  rating?: number;
  reviewCount?: number;
}

interface PerplexityMenuDish {
  name: string;
  price: string;
  category?: string;
  description?: string;
}

interface PerplexityMenuData {
  dishes: PerplexityMenuDish[];
  confidence: 'high' | 'medium' | 'low';
  source: string;
  sourceUrl?: string;
  lastUpdated?: string;
}

// Server-side Perplexity API proxy to bypass CORS restrictions
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { restaurantInfo }: { restaurantInfo: RestaurantInfo } = req.body;

    if (!restaurantInfo || !restaurantInfo.name) {
      return res.status(400).json({ error: 'Restaurant info with name is required' });
    }

    console.log(`🔍 Server-side menu analysis for: ${restaurantInfo.name}`);

    // Get Perplexity API key from environment
    const apiKey = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.warn('🔑 Perplexity API key not found in server environment');
      return res.status(500).json({ error: 'Perplexity API not configured' });
    }

    // Build the search query using the same refined prompts from PerplexityMenuService
    const searchQuery = buildSearchQuery(restaurantInfo);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [{
          role: 'user',
          content: searchQuery
        }],
        max_tokens: 2000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Perplexity');
    }

    console.log('📋 Perplexity raw response preview:', content.substring(0, 200) + '...');

    // Parse the response to extract menu data using the same logic
    const menuData = parseMenuResponse(content, restaurantInfo);
    
    if (menuData && menuData.dishes.length > 0) {
      console.log(`✅ Found ${menuData.dishes.length} menu items with ${menuData.confidence} confidence`);
      return res.status(200).json(menuData);
    } else {
      console.warn('⚠️ No menu items found in Perplexity response');
      return res.status(404).json({ error: 'No menu items found' });
    }

  } catch (error) {
    console.error('❌ Server-side menu analysis failed:', error);
    return res.status(500).json({ 
      error: 'Menu analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Same refined search query from PerplexityMenuService
function buildSearchQuery(restaurantInfo: RestaurantInfo): string {
  const location = restaurantInfo.address || '';
  
  return `You are a professional menu data extraction specialist. Your job is to find EXACT, CURRENT menu items and prices for "${restaurantInfo.name}" restaurant located at ${location}.

MANDATORY SEARCH STRATEGY - Search ONLY these 3 platforms in this order:
1. 🍔 Uber Eats: site:ubereats.com.au OR site:ubereats.com "${restaurantInfo.name}" ${location}
2. 🚗 DoorDash: site:doordash.com "${restaurantInfo.name}" ${location}
3. 🥘 Zomato: site:zomato.com "${restaurantInfo.name}" ${location}

CRITICAL EXTRACTION RULES:
✅ MUST HAVES:
- Copy the EXACT item name as it appears on the menu (no paraphrasing)
- Extract the EXACT price shown (including cents: $12.50, not $12)
- Only include items you can actually see on these platforms
- Cross-verify suspicious items exist on multiple platforms

✅ PRICING RULES:
- Use base price if you see "from $X.XX" 
- Include GST/tax if already in the displayed price
- Round to 2 decimal places ($16.90, not $16.9)
- Flag items under $5 or over $50 as potentially suspicious

❌ STRICT PROHIBITIONS:
❌ NO generic names like "Various pasta dishes" or "Pizza options"
❌ NO estimated, approximate, or made-up prices
❌ NO items that appear on only one obscure source
❌ NO combining similar items into categories
❌ NO adding items you think "should be there"
❌ NO menu items older than 6 months

VERIFICATION CHECKLIST:
🔍 Can you find this exact item name on the platform?
🔍 Is the price clearly displayed (not a range)?
🔍 Does this item make sense for this type of restaurant?
🔍 Is the name specific (not generic like "pasta" or "burger")?

REQUIRED OUTPUT FORMAT - Use this EXACT structure:
**[EXACT ITEM NAME FROM MENU]**
Price: $XX.XX
Platform: [Uber Eats/DoorDash/Zomato]
Verification: ✅ [platform]
URL: [direct link if available]

EXAMPLE (follow this format exactly):
**Margherita Pizza (Large)**
Price: $22.50
Platform: Uber Eats
Verification: ✅ Uber Eats
URL: https://ubereats.com/au/...

**Garlic Bread (4 pieces)**
Price: $8.90
Platform: Zomato
Verification: ✅ Zomato
URL: https://zomato.com/...

QUALITY REQUIREMENTS:
- Find 8-12 specific menu items with exact names and prices
- Prioritize popular/signature items over generic ones
- Include size/portion details in item names when shown
- Double-check any item that seems unusual for this restaurant type

TARGET RESTAURANT: ${restaurantInfo.name}
LOCATION: ${location}
FOCUS: Real menu items from Uber Eats, DoorDash, and Zomato only`;
}

// Same parsing logic from PerplexityMenuService
function parseMenuResponse(content: string, restaurantInfo: RestaurantInfo): PerplexityMenuData | null {
  try {
    const dishes: PerplexityMenuDish[] = [];
    let source = 'Web search';
    let sourceUrl = '';
    
    // Extract source URLs and determine primary source (focusing on the 3 platforms)
    const urlMatches = content.match(/https?:\/\/[^\s\)]+/g);
    const sources = new Set<string>();
    
    if (urlMatches && urlMatches.length > 0) {
      // Prioritize our 3 target platforms
      urlMatches.forEach(url => {
        if (url.includes('ubereats')) sources.add('Uber Eats');
        else if (url.includes('doordash')) sources.add('DoorDash');
        else if (url.includes('zomato')) sources.add('Zomato');
      });
      
      // Set primary source and URL based on priority
      if (sources.has('Uber Eats')) {
        source = 'Uber Eats';
        sourceUrl = urlMatches.find(url => url.includes('ubereats')) || urlMatches[0];
      } else if (sources.has('DoorDash')) {
        source = 'DoorDash';
        sourceUrl = urlMatches.find(url => url.includes('doordash')) || urlMatches[0];
      } else if (sources.has('Zomato')) {
        source = 'Zomato';
        sourceUrl = urlMatches.find(url => url.includes('zomato')) || urlMatches[0];
      } else {
        sourceUrl = urlMatches[0];
        source = 'Other platform';
      }
    }

    console.log(`🔍 Detected source: ${source} from ${sources.size} target platforms`);
    
    // Enhanced parsing for the new structured format
    const patterns = [
      // Format: **[EXACT ITEM NAME]**\nPrice: $X.XX\nPlatform: [Platform]\nVerification: ✅
      /\*\*\[?([^\]]+?)\]?\*\*[\s\S]*?Price:\s*\$(\d+(?:\.\d{2})?)[\s\S]*?Platform:\s*([^\n]+)[\s\S]*?Verification:\s*✅/gi,
      // Format: **Item Name**\nPrice: $X.XX\nPlatform: [Platform]
      /\*\*([^*]+?)\*\*[\s\S]*?Price:\s*\$(\d+(?:\.\d{2})?)[\s\S]*?Platform:\s*([^\n]+)/gi,
      // Fallback: **Item Name**\nPrice: $X.XX (without platform)
      /\*\*([^*]+?)\*\*[\s\S]*?Price:\s*\$(\d+(?:\.\d{2})?)/gi,
      // Legacy format: • Item Name: $X.XX
      /[•\-\*]\s*([^$\n:]+?):\s*(?:from\s+)?\$(\d+(?:\.\d{2})?)/gi
    ];

    console.log(`📊 Parsing response with ${patterns.length} patterns for enhanced accuracy...`);
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      let match;
      let patternMatches = 0;
      
      while ((match = pattern.exec(content)) !== null) {
        const dishName = match[1];
        const price = match[2];
        const dishSource = match[3] || source;
        
        if (dishName && price && isValidDishName(dishName) && isValidPrice(price)) {
          const cleanName = cleanDishName(dishName);
          
          // Additional validation to prevent hallucinated items
          if (isReasonableDishName(cleanName, restaurantInfo.cuisineType)) {
            const category = extractCategoryFromContext(content, cleanName);
            
            dishes.push({
              name: cleanName,
              price: `$${parseFloat(price).toFixed(2)}`,
              category: category || undefined,
              description: extractDescriptionFromContext(content, cleanName)
            });
            
            patternMatches++;
          } else {
            console.warn(`⚠️ Filtering out suspicious item: ${cleanName}`);
          }
        }
      }
      
      console.log(`📝 Pattern ${i + 1} found ${patternMatches} validated matches`);
      pattern.lastIndex = 0;
    }

    // Remove duplicates and validate
    const uniqueDishes = removeDuplicateDishes(dishes);
    
    // Enhanced confidence scoring based on target platforms
    let confidence: 'high' | 'medium' | 'low' = 'low';
    
    if (uniqueDishes.length >= 6 && sources.size >= 1 && (sources.has('Uber Eats') || sources.has('DoorDash') || sources.has('Zomato'))) {
      confidence = 'high';
    } else if (uniqueDishes.length >= 4 && sources.size >= 1) {
      confidence = 'medium';
    } else if (uniqueDishes.length >= 2) {
      confidence = 'low';
    } else {
      console.warn('❌ No valid dishes found after enhanced validation');
      return null;
    }

    console.log(`📊 Final result: ${uniqueDishes.length} validated dishes from ${source}, confidence: ${confidence}`);
    
    return {
      dishes: uniqueDishes.slice(0, 15), // Increased limit to 15 for better selection
      confidence,
      source,
      sourceUrl,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error parsing Perplexity response:', error);
    return null;
  }
}

// Helper functions (same as in PerplexityMenuService)
function cleanDishName(name: string): string {
  return name.trim()
    .replace(/^\*+|\*+$/g, '') // Remove asterisks
    .replace(/^#+|#+$/g, '')   // Remove hashes
    .replace(/^-+|-+$/g, '')   // Remove dashes at start/end
    .replace(/^\d+\.?\s*/, '') // Remove numbers at start
    .replace(/^[•\-\*]\s*/, '') // Remove bullet points
    .replace(/\s+/g, ' ')      // Normalize spaces
    .trim();
}

function isValidPrice(price: string): boolean {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum > 0 && priceNum < 200; // Reasonable price range
}

function isValidDishName(name: string): boolean {
  const cleanName = name.trim().toLowerCase();
  
  // Block obvious non-dish names
  const invalidNames = [
    'price', 'platform', 'verification', 'url', 'source',
    'various', 'multiple', 'selection of', 'range of',
    'confirmed', 'menu', 'items', 'dishes'
  ];
  
  return cleanName.length > 2 && 
         cleanName.length < 100 && 
         !cleanName.includes('$') &&
         !invalidNames.some(invalid => cleanName.includes(invalid));
}

function isReasonableDishName(name: string, cuisineType?: string): boolean {
  const lowerName = name.toLowerCase();
  
  // Check for obviously generic or suspicious names
  const suspiciousPatterns = [
    'various', 'multiple', 'selection', 'range of', 'different',
    'assorted', 'mixed', 'combo deal', 'special offer',
    'chef special', 'house special', 'daily special',
    'price', 'platform', 'verification', 'confirmed', 'url'
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (lowerName.includes(pattern)) {
      return false;
    }
  }
  
  // Must contain at least one alphabetic character
  if (!/[a-zA-Z]/.test(name)) {
    return false;
  }
  
  // Should not be just numbers or very short
  if (name.length < 4) {
    return false;
  }
  
  return true;
}

function extractDescriptionFromContext(content: string, dishName: string): string | undefined {
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.toLowerCase().includes(dishName.toLowerCase())) {
      // Look for description in next few lines
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const descLine = lines[j].trim();
        if (descLine && 
            !descLine.includes('$') && 
            !descLine.includes('Price:') &&
            !descLine.includes('Source:') &&
            descLine.length > 10 && 
            descLine.length < 200) {
          return descLine;
        }
      }
    }
  }
  
  return undefined;
}

function extractCategoryFromContext(content: string, dishName: string): string | null {
  // Look for section headers before the dish
  const lines = content.split('\n');
  let currentCategory = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line contains our dish
    if (line.toLowerCase().includes(dishName.toLowerCase())) {
      return currentCategory;
    }
    
    // Check if this line is a category header
    if (isCategoryHeader(line)) {
      currentCategory = line.replace(/[#*\-•]/g, '').trim();
    }
  }
  
  return null;
}

function isCategoryHeader(line: string): boolean {
  const cleanLine = line.trim();
  
  // Check for common category patterns
  const categoryPatterns = [
    /^#+\s*[A-Z]/,           // # Header
    /^[A-Z][^$]*(?:Range|Menu|Items|Selection)$/i,  // Category words
    /^\*\*[^*]+\*\*$/,       // **Bold text**
    /^[A-Z][A-Z\s&]+$/       // ALL CAPS categories
  ];
  
  return categoryPatterns.some(pattern => pattern.test(cleanLine)) && 
         !cleanLine.includes('$') && 
         cleanLine.length < 50;
}

function removeDuplicateDishes(dishes: PerplexityMenuDish[]): PerplexityMenuDish[] {
  const seen = new Set<string>();
  const unique: PerplexityMenuDish[] = [];
  
  for (const dish of dishes) {
    // Create a more comprehensive normalized name for comparison
    const normalizedName = dish.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove all non-alphanumeric except spaces
      .replace(/\s+/g, ' ')        // Normalize spaces
      .trim();
    
    if (!seen.has(normalizedName) && normalizedName.length > 2) {
      seen.add(normalizedName);
      unique.push(dish);
    }
  }
  
  // Sort by price (ascending) to get consistent ordering
  return unique.sort((a, b) => {
    const priceA = parseFloat(a.price.replace('$', ''));
    const priceB = parseFloat(b.price.replace('$', ''));
    return priceA - priceB;
  });
}