// Claude API integration for real menu data extraction
const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || 'YOUR_CLAUDE_API_KEY';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Use Sonnet 3.5 for better reasoning and menu analysis
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // Better reasoning for menu analysis

export interface ClaudeMenuData {
  restaurant: string;
  dishes: Array<{
    name: string;
    price: string;
    category: string;
    description?: string;
  }>;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
  totalDishes: number;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  cuisineType: string;
  priceLevel: number;
  rating: number;
  reviewCount: number;
}

export class ClaudeMenuService {
  
  static async extractMenuData(restaurantInfo: RestaurantInfo): Promise<ClaudeMenuData | null> {
    if (!isClaudeConfigured()) {
      console.log('❌ Claude API not configured - missing API token');
      return null;
    }

    try {
      console.log(`🔍 Starting Claude menu search for: ${restaurantInfo.name}`);
      console.log(`📍 Location: ${restaurantInfo.address}`);
      
      const prompt = this.buildMenuSearchPrompt(restaurantInfo);
      
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      console.log(`📊 Claude response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Claude API error: ${response.status} - ${errorText}`);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;
      
      if (!content) {
        console.error('❌ No content in Claude response');
        console.log('🔍 Full response:', JSON.stringify(data, null, 2));
        throw new Error('No content in Claude response');
      }

      console.log(`📝 Claude response content length: ${content.length} characters`);
      console.log(`📄 Claude response preview: ${content.substring(0, 200)}...`);

      const menuData = this.parseClaudeResponse(content);
      
      if (menuData) {
        console.log(`🤖 AI menu analysis generated successfully`);
        console.log(`📊 Analysis quality: ${menuData.confidence} confidence`);
        console.log(`🍽️ Generated ${menuData.dishes.length} likely menu items based on cuisine and restaurant profile`);
        console.log(`📍 Analysis method: ${menuData.source}`);
        console.log(`🍴 Sample items:`, menuData.dishes.slice(0, 3).map(d => `${d.name} (${d.price})`));
        console.log(`💡 Next step: Contact restaurant to verify actual menu items`);
        return menuData;
      } else {
        console.log('❌ Failed to parse menu data from Claude response');
        return null;
      }

    } catch (error) {
      console.error('❌ Error extracting menu data with Claude:', error);
      return null;
    }
  }

  private static buildMenuSearchPrompt(restaurantInfo: RestaurantInfo): string {
    return `You are a menu analysis assistant helping a B2B food supplier understand likely menu offerings for restaurants.

IMPORTANT: You cannot browse the web or access real-time data. Based on the restaurant information provided, generate realistic menu items that would typically be found at this type of establishment.

Restaurant Information:
- Name: ${restaurantInfo.name}
- Address: ${restaurantInfo.address}
- Cuisine Type: ${restaurantInfo.cuisineType}
- Price Level: ${restaurantInfo.priceLevel}/4 (1=budget, 4=expensive)
- Rating: ${restaurantInfo.rating}/5 stars
- Website: ${restaurantInfo.website || 'Not provided'}

Your Task:
1. Analyze the restaurant type, location, and cuisine
2. Generate 6-8 realistic menu items that would likely be served there
3. Estimate appropriate prices based on the price level and location
4. Use your knowledge of typical dishes for this cuisine type
5. Consider the restaurant's rating and price point for pricing

Pricing Guidelines:
- Price Level 1 (Budget): Mains $12-20, Apps $6-12
- Price Level 2 (Moderate): Mains $18-28, Apps $8-16  
- Price Level 3 (Upscale): Mains $25-40, Apps $12-22
- Price Level 4 (Fine Dining): Mains $35-60, Apps $16-30

Return realistic menu analysis in this JSON format:

{
  "restaurant": "${restaurantInfo.name}",
  "dishes": [
    {
      "name": "Typical dish name for this cuisine",
      "price": "$XX.XX",
      "category": "Mains|Appetizers|Desserts|Drinks",
      "description": "Brief description of the dish"
    }
  ],
  "source": "AI analysis based on restaurant type and cuisine",
  "confidence": "medium",
  "lastUpdated": "${new Date().toISOString().split('T')[0]}",
  "totalDishes": 0
}

Guidelines:
- Use authentic dish names for the cuisine type
- Price appropriately for the location and restaurant level
- Include popular items that would typically be on menus of this type
- Mix categories (mains, appetizers, desserts)
- Be realistic about what this type of restaurant would serve
- Set confidence to "medium" since this is AI analysis, not real menu data

Examples by cuisine:
- Italian: Margherita Pizza, Carbonara, Tiramisu
- Japanese: Chicken Teriyaki, Salmon Sashimi, Miso Soup
- Mexican: Fish Tacos, Guacamole, Churros
- Modern Australian: Barramundi, Lamb Rack, Pavlova

Return ONLY the JSON object.`;
  }

  private static parseClaudeResponse(content: string): ClaudeMenuData | null {
    try {
      console.log('🔍 Raw Claude response:', content.substring(0, 500) + '...');
      
      // Try to extract JSON from Claude's response (it might include extra text)
      // Look for JSON between curly braces
      let jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        // Try alternative patterns - sometimes Claude wraps JSON in code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          jsonMatch = [codeBlockMatch[1]];
        }
      }
      
      if (!jsonMatch) {
        // Last attempt: look for JSON-like structure with looser matching
        const looserMatch = content.match(/restaurant.*?\{[\s\S]*?\}/);
        if (looserMatch) {
          jsonMatch = [looserMatch[0]];
        }
      }
      
      if (!jsonMatch) {
        console.error('❌ No JSON found in Claude response. Raw content:', content);
        return null;
      }

      const jsonStr = jsonMatch[0];
      console.log('📄 Extracted JSON string:', jsonStr.substring(0, 300) + '...');
      
      let data;
      try {
        data = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.log('🔧 Attempting to clean JSON...');
        
        // Try to clean common JSON issues
        let cleanedJson = jsonStr
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
          .replace(/,\s*}/g, '}') // Remove trailing commas
          .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
        
        try {
          data = JSON.parse(cleanedJson);
          console.log('✅ Successfully parsed cleaned JSON');
        } catch (cleanError) {
          console.error('❌ Failed to parse cleaned JSON:', cleanError);
          return null;
        }
      }
      
      // Validate the response structure
      if (!data.restaurant || !Array.isArray(data.dishes)) {
        console.error('❌ Invalid menu data structure from Claude:', data);
        return null;
      }

      // Set totalDishes count
      data.totalDishes = data.dishes.length;

      console.log(`🍽️ Parsed ${data.dishes.length} dishes from Claude response`);
      data.dishes.forEach((dish: any, index: number) => {
        console.log(`   ${index + 1}. ${dish.name} - ${dish.price} (${dish.category})`);
      });

      return data as ClaudeMenuData;
    } catch (error) {
      console.error('❌ Error parsing Claude response:', error);
      console.log('📄 Raw content for debugging:', content);
      return null;
    }
  }

  static generateMenuAnalysisFromClaudeData(
    claudeData: ClaudeMenuData,
    restaurantInfo: RestaurantInfo
  ): any {
    console.log(`🍽️ Generating AI-based menu analysis from ${claudeData.dishes.length} dishes`);
    console.log(`📋 Source: ${claudeData.source}, Confidence: ${claudeData.confidence}`);
    console.log(`📄 Dishes:`, claudeData.dishes.map(d => `${d.name} - ${d.price}`));

    // Create source URL for searching
    const sourceUrl = `https://www.google.com/search?q=${encodeURIComponent(restaurantInfo.name + ' menu ' + restaurantInfo.address)}`;

    const menuAnalysis = {
      title: 'AI Menu Analysis',
      subtitle: `🤖 AI-generated menu analysis based on ${restaurantInfo.cuisineType} cuisine and restaurant profile (${claudeData.dishes.length} likely items)`,
      topItems: claudeData.dishes.slice(0, 3).map((dish, index) => {
        // Ensure proper price formatting
        let formattedPrice = dish.price;
        if (!formattedPrice.startsWith('$')) {
          formattedPrice = `$${formattedPrice}`;
        }
        
        // Clean and format dish name
        const displayName = dish.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();
        
        const categoryDisplay = dish.category || 'Menu Item';
        
        console.log(`📄 Processing AI-generated dish ${index + 1}: "${displayName}" at ${formattedPrice}`);
        
        return {
          id: `claude-dish-${index}`,
          name: displayName,
          price: formattedPrice,
          category: categoryDisplay,
          description: dish.description,
          productMatches: [{
            name: `🤖 AI-predicted menu item: ${displayName} (${categoryDisplay})`,
            sourceNote: `🔮 AI analysis based on ${restaurantInfo.cuisineType} cuisine and restaurant profile`
          }],
          pitchAngle: `Based on AI analysis, "${displayName}" is a likely menu item for a ${restaurantInfo.cuisineType} restaurant like ${restaurantInfo.name}. Contact the restaurant to verify actual menu items, then premium ingredients can enhance this type of dish quality.`,
          menuSourceLink: {
            label: 'Search for Real Menu',
            url: sourceUrl,
            platform: 'Google Search',
            isAIGenerated: true
          },
          matches: [{
            id: `claude-ingredient-${index}`,
            name: `Ingredients typically used for ${displayName}`,
            matchPercentage: 75, // Medium confidence for AI predictions
            defaultPrice: `$${(8 + Math.random() * 6).toFixed(2)}`,
            retailPrice: `$${(12 + Math.random() * 8).toFixed(2)}`,
            yourPrice: `$${(10 + Math.random() * 6).toFixed(2)}`,
            avgMargin: `$${(2 + Math.random() * 3).toFixed(2)} / ${(6 + Math.random() * 4).toFixed(1)}%`,
            alternatives: []
          }]
        };
      }),
      allDishes: claudeData.dishes,
      sourceInfo: {
        platform: claudeData.source,
        confidence: claudeData.confidence,
        lastUpdated: claudeData.lastUpdated,
        totalDishes: claudeData.totalDishes,
        isAIGenerated: true,
        needsVerification: true
      }
    };

    console.log(`🤖 Generated AI-based menu analysis:`, menuAnalysis.topItems.map(item => `${item.name} - ${item.price}`));
    console.log(`💡 Recommendation: Contact restaurant to verify actual menu items`);
    
    return menuAnalysis;
  }

  // Test function to validate Claude API setup
  static async testClaudeConnection(): Promise<boolean> {
    if (!isClaudeConfigured()) {
      console.log('❌ Claude API not configured');
      return false;
    }

    try {
      console.log('🧪 Testing Claude API connection...');
      
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: 'Hello, please respond with just "API connection successful"'
            }
          ]
        })
      });

      console.log(`📊 Test response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Claude connection successful! Response: ${data.content?.[0]?.text}`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ Claude connection failed: ${response.status} - ${errorText}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error testing Claude connection:', error);
      return false;
    }
  }
}

export const isClaudeConfigured = () => {
  return CLAUDE_API_KEY && CLAUDE_API_KEY !== 'YOUR_CLAUDE_API_KEY';
}; 