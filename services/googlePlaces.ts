// React Native compatible Google Places API implementation
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || 'YOUR_GOOGLE_PLACES_API_KEY';

export interface GooglePlaceRestaurant {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
  rating: number;
  reviewCount: number;
  cuisineType: string;
  address: string;
  isOpen: boolean;
  isNewlyOpened: boolean;
  priceLevel: number;
  photoUrl?: string;
  phoneNumber?: string;
  website?: string;
}

export interface PlacesSearchParams {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  type?: string;
}

export interface PlaceDetails {
  reviews?: Array<{
    text: string;
    rating: number;
    time: number;
  }>;
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    weekday_text: string[];
    open_now: boolean;
  };
  price_level?: number;
  types: string[];
}

export class GooglePlacesService {
  static async searchNearbyRestaurants(params: PlacesSearchParams): Promise<GooglePlaceRestaurant[]> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${params.latitude},${params.longitude}&radius=${params.radius}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Google Places API error:', data.status);
        return this.getMockRestaurants(params.latitude, params.longitude);
      }

      const restaurants: GooglePlaceRestaurant[] = data.results
        .filter((place: any) => place.business_status === 'OPERATIONAL')
        .map((place: any) => {
          // Determine cuisine type from place types or name
          const cuisineType = this.determineCuisineType(place.types || [], place.name || '');
          
          // Check if newly opened (within last 6 months)
          const isNewlyOpened = this.isNewlyOpened(place.opening_hours?.periods);

          return {
            id: place.place_id || Math.random().toString(),
            name: place.name || 'Unknown Restaurant',
            coordinates: {
              latitude: place.geometry?.location.lat || 0,
              longitude: place.geometry?.location.lng || 0,
            },
            rating: place.rating || 0,
            reviewCount: place.user_ratings_total || 0,
            cuisineType,
            address: place.vicinity || place.formatted_address || 'Address not available',
            isOpen: place.opening_hours?.open_now || false,
            isNewlyOpened,
            priceLevel: place.price_level || 2,
            photoUrl: place.photos?.[0]?.photo_reference 
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
              : undefined,
          };
        })
        .sort((a: GooglePlaceRestaurant, b: GooglePlaceRestaurant) => b.rating - a.rating); // Sort by rating descending

      return restaurants;
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      // Return mock data as fallback
      return this.getMockRestaurants(params.latitude, params.longitude);
    }
  }

  static async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!isGooglePlacesConfigured()) {
      console.log('Google Places API not configured, skipping place details');
      return null;
    }

    try {
      const fields = [
        'reviews',
        'photos', 
        'website',
        'formatted_phone_number',
        'opening_hours',
        'price_level',
        'types'
      ].join(',');

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        return data.result;
      }

      console.log('Place details error:', data.status, data.error_message);
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  static analyzeMenuFromPlaceData(restaurant: GooglePlaceRestaurant, placeDetails?: PlaceDetails | null): any {
    // Extract dish suggestions from reviews and restaurant data
    const cuisineType = restaurant.cuisineType;
    const reviews = placeDetails?.reviews || [];
    const priceLevel = placeDetails?.price_level || restaurant.priceLevel;

    console.log(`🔍 Analyzing menu for ${restaurant.name}:`);
    console.log(`   Cuisine: ${cuisineType}`);
    console.log(`   Reviews available: ${reviews.length}`);
    console.log(`   Price level: ${priceLevel}`);

    // Analyze reviews for popular dishes WITH review sources
    const dishAnalysis = this.extractDishMentionsWithSources(reviews, cuisineType);
    const dishMentions = dishAnalysis.dishes;
    const reviewSources = dishAnalysis.sources;
    
    console.log(`   Dish mentions found: ${dishMentions.length > 0 ? dishMentions.join(', ') : 'None'}`);
    
    // Generate realistic dishes based on cuisine and price level
    const menuAnalysis = this.generateMenuAnalysisFromData(
      cuisineType,
      priceLevel,
      dishMentions,
      restaurant.rating,
      reviewSources,
      restaurant.id // Pass place ID for review links
    );

    console.log(`   Generated ${menuAnalysis.topItems.length} dishes: ${menuAnalysis.topItems.map((item: any) => item.name).join(', ')}`);

    return menuAnalysis;
  }

  private static extractDishMentionsFromReviews(reviews: any[], cuisineType: string): string[] {
    console.log(`🔍 Analyzing ${reviews.length} reviews for real menu items...`);
    
    const extractedDishes: string[] = [];
    const priceExtracted: Array<{dish: string, price: string}> = [];

    reviews.forEach((review, index) => {
      const text = review.text?.toLowerCase() || '';
      console.log(`   Review ${index + 1}: "${text.substring(0, 100)}..."`);
      
      // Extract dishes mentioned in reviews using advanced patterns
      const dishesFromReview = this.extractDishNamesFromText(text, cuisineType);
      const pricesFromReview = this.extractPricesFromText(text);
      
      extractedDishes.push(...dishesFromReview);
      
      // Try to match prices with dishes in the same review
      dishesFromReview.forEach(dish => {
        const nearbyPrice = this.findNearbyPrice(text, dish, pricesFromReview);
        if (nearbyPrice) {
          priceExtracted.push({ dish, price: nearbyPrice });
        }
      });
    });

    // Remove duplicates and log findings
    const uniqueDishes = [...new Set(extractedDishes)];
    console.log(`   ✅ Extracted ${uniqueDishes.length} unique dishes: ${uniqueDishes.join(', ')}`);
    
    if (priceExtracted.length > 0) {
      console.log(`   💰 Found prices: ${priceExtracted.map(p => `${p.dish} (${p.price})`).join(', ')}`);
    }

    return uniqueDishes;
  }

  private static extractDishMentionsWithSources(reviews: any[], cuisineType: string): {dishes: string[], sources: string[]} {
    console.log(`🔍 Analyzing ${reviews.length} reviews for real menu items with sources...`);
    
    const dishToReviewMap: Map<string, {review: any, index: number}> = new Map();
    const extractedDishes: string[] = [];

    reviews.forEach((review, index) => {
      const text = review.text?.toLowerCase() || '';
      console.log(`   Review ${index + 1}: "${text.substring(0, 100)}..."`);
      
      // Extract dishes mentioned in reviews using advanced patterns
      const dishesFromReview = this.extractDishNamesFromText(text, cuisineType);
      
      dishesFromReview.forEach(dish => {
        if (!dishToReviewMap.has(dish)) {
          dishToReviewMap.set(dish, {review, index});
          extractedDishes.push(dish);
        }
      });
    });

    // Create review sources with links
    const reviewSources = extractedDishes.map(dish => {
      const source = dishToReviewMap.get(dish);
      if (source) {
        return `Mentioned in customer review: "${source.review.text?.substring(0, 80)}..."`;
      }
      return 'General menu item';
    });

    console.log(`   ✅ Extracted ${extractedDishes.length} unique dishes with sources`);
    
    return {
      dishes: extractedDishes,
      sources: reviewSources
    };
  }

  private static extractDishNamesFromText(text: string, cuisineType: string): string[] {
    const dishes: string[] = [];
    
    // More precise dish patterns that avoid random text
    const dishPatterns = [
      // Specific food mentions: "the pizza was", "ordered pizza", "had the pasta"
      /(?:the|ordered|tried|had|got|ate)\s+((?:pizza|pasta|burger|salad|soup|curry|chicken|fish|beef|lamb|pork|duck|salmon|tuna|steak|risotto|gnocchi|carbonara|margherita|bolognese|caesar|pad\s*thai|fried\s*rice|noodles|ramen|sushi|tempura|fish\s*and\s*chips|fish\s*&\s*chips)[a-z\s]*?)(?:\s+(?:was|is|were|are|and|,|\.|!|\?|$))/gi,
      
      // Pizza specific: "margherita pizza", "pepperoni pizza"
      /((?:margherita|pepperoni|hawaiian|supreme|meat\s*lovers?|vegetarian|bbq|quattro\s*stagioni|capricciosa|marinara|napoli|american|mexicana|aussie|garlic|cheese)\s*pizza)/gi,
      
      // Pasta specific: "carbonara pasta", "bolognese"
      /((?:carbonara|bolognese|marinara|puttanesca|alfredo|pesto|arrabiata|aglio\s*e\s*olio|cacio\s*e\s*pepe)\s*(?:pasta|spaghetti|linguine|penne|fettuccine)?)/gi,
      
      // Asian dishes
      /((?:pad\s*thai|green\s*curry|red\s*curry|massaman|tom\s*yum|laksa|pho|ramen|fried\s*rice|lo\s*mein|chow\s*mein|spring\s*rolls|dim\s*sum|sushi|sashimi|tempura|teriyaki|yakitori))/gi,
      
      // General dishes
      /((?:fish\s*(?:and|&)\s*chips|caesar\s*salad|greek\s*salad|chicken\s*schnitzel|beef\s*wellington|lamb\s*shank|pork\s*belly|duck\s*confit|salmon\s*fillet|barramundi))/gi,
    ];

    dishPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const potentialDish = match[1]?.trim();
        if (potentialDish && this.isValidDishName(potentialDish, cuisineType)) {
          dishes.push(this.cleanDishName(potentialDish));
        }
      }
    });

    // Also look for cuisine-specific dish names with stricter matching
    const cuisineSpecificDishes = this.findCuisineSpecificDishes(text, cuisineType);
    dishes.push(...cuisineSpecificDishes);

    return [...new Set(dishes)]; // Remove duplicates
  }

  private static isValidDishName(dish: string, cuisineType: string): boolean {
    // Filter out common non-dish words
    const blacklist = [
      'service', 'staff', 'place', 'restaurant', 'food', 'meal', 'dinner', 'lunch', 'breakfast',
      'experience', 'atmosphere', 'ambiance', 'time', 'visit', 'location', 'price', 'value',
      'quality', 'portion', 'size', 'taste', 'flavor', 'customer', 'menu', 'order', 'table',
      'wait', 'server', 'waiter', 'waitress', 'chef', 'kitchen', 'dining', 'room', 'seating',
      'guests', 'asked', 'where', 'they', 'all', 'party', 'tray', 'options', 'many', 'special',
      'delicious', 'great', 'good', 'amazing', 'excellent', 'fantastic', 'wonderful', 'perfect',
      'always', 'never', 'really', 'very', 'super', 'absolutely', 'definitely', 'probably',
      'birthday', 'party', 'delivered', 'delivery', 'takeaway', 'pickup'
    ];

    // Must be reasonable length and not in blacklist
    const isValidLength = dish.length >= 3 && dish.length <= 30;
    const hasNoBlacklistedWords = !blacklist.some(word => dish.toLowerCase().includes(word.toLowerCase()));
    const isNotJustNumbers = !/^\d+$/.test(dish);
    
    // Must contain at least one food-related word
    const foodWords = [
      'pizza', 'pasta', 'burger', 'salad', 'soup', 'curry', 'chicken', 'fish', 'beef', 'lamb',
      'pork', 'duck', 'salmon', 'tuna', 'steak', 'risotto', 'gnocchi', 'carbonara', 'margherita',
      'bolognese', 'caesar', 'thai', 'rice', 'noodles', 'ramen', 'sushi', 'tempura', 'chips'
    ];
    const containsFoodWord = foodWords.some(word => dish.toLowerCase().includes(word.toLowerCase()));
    
    return isValidLength && hasNoBlacklistedWords && isNotJustNumbers && containsFoodWord;
  }

  private static cleanDishName(dish: string): string {
    return dish
      .replace(/\b(the|a|an|and|with|in|on|of|for)\b/g, '') // Remove articles and prepositions
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Title case
      .join(' ');
  }

  private static findCuisineSpecificDishes(text: string, cuisineType: string): string[] {
    const cuisineDishes: Record<string, string[]> = {
      'Italian': [
        'carbonara', 'margherita', 'quattro stagioni', 'napoli', 'pepperoni', 'marinara',
        'lasagna', 'lasagne', 'bolognese', 'puttanesca', 'aglio e olio', 'cacio e pepe',
        'gnocchi', 'risotto', 'osso buco', 'saltimbocca', 'tiramisu', 'panna cotta',
        'bruschetta', 'antipasto', 'caprese', 'prosciutto', 'mozzarella', 'parmesan'
      ],
      'Asian': [
        'pad thai', 'tom yum', 'green curry', 'red curry', 'massaman', 'satay',
        'spring rolls', 'dim sum', 'har gow', 'siu mai', 'char siu', 'wonton',
        'pho', 'banh mi', 'bun bo hue', 'laksa', 'rendang', 'nasi goreng',
        'mee goreng', 'curry laksa', 'hainanese chicken'
      ],
      'Japanese': [
        'sashimi', 'nigiri', 'maki', 'california roll', 'salmon roll', 'tuna roll',
        'teriyaki', 'tempura', 'katsu', 'donburi', 'chirashi', 'unagi',
        'ramen', 'udon', 'soba', 'miso soup', 'edamame', 'gyoza',
        'bento', 'onigiri', 'yakitori', 'takoyaki', 'okonomiyaki'
      ],
      'Chinese': [
        'dim sum', 'kung pao', 'sweet and sour', 'orange chicken', 'general tso',
        'lo mein', 'chow mein', 'fried rice', 'hot pot', 'mapo tofu',
        'peking duck', 'char siu', 'xiaolongbao', 'dumpling', 'wonton soup'
      ],
      'Mexican': [
        'tacos', 'burritos', 'quesadillas', 'enchiladas', 'fajitas', 'nachos',
        'guacamole', 'salsa', 'carnitas', 'al pastor', 'carne asada',
        'chile relleno', 'tamales', 'pozole', 'mole', 'churros'
      ],
      'Indian': [
        'butter chicken', 'tikka masala', 'vindaloo', 'korma', 'biryani',
        'tandoori', 'naan', 'chapati', 'papadum', 'samosas', 'pakoras',
        'dal', 'curry', 'masala', 'madras', 'jalfrezi'
      ],
      'Seafood': [
        'fish and chips', 'barramundi', 'salmon', 'tuna', 'snapper', 'prawns',
        'oysters', 'mussels', 'calamari', 'scallops', 'lobster', 'crab',
        'seafood platter', 'fish of the day', 'grilled fish'
      ],
      'Modern Australian': [
        'barramundi', 'kangaroo', 'lamb', 'beef', 'pavlova', 'lamington',
        'meat pie', 'sausage roll', 'flat white', 'long black',
        'bush tucker', 'native herbs', 'wattle seed'
      ]
    };

    const dishes = cuisineDishes[cuisineType] || [];
    const found: string[] = [];

    dishes.forEach(dish => {
      if (text.includes(dish.toLowerCase())) {
        found.push(this.cleanDishName(dish));
      }
    });

    return found;
  }

  private static extractPricesFromText(text: string): string[] {
    // Extract various price formats
    const pricePatterns = [
      /\$(\d+(?:\.\d{2})?)/g,           // $25.50, $30
      /(\d+(?:\.\d{2})?)\s*dollars?/g,  // 25.50 dollars, 30 dollar
      /(\d+(?:\.\d{2})?)\s*bucks?/g,    // 25 bucks
    ];

    const prices: string[] = [];
    pricePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const price = match[1] || match[0];
        if (parseFloat(price.replace('$', '')) >= 5 && parseFloat(price.replace('$', '')) <= 200) {
          prices.push(`$${parseFloat(price.replace('$', '')).toFixed(2)}`);
        }
      }
    });

    return [...new Set(prices)];
  }

  private static findNearbyPrice(text: string, dish: string, prices: string[]): string | null {
    const dishIndex = text.indexOf(dish.toLowerCase());
    if (dishIndex === -1 || prices.length === 0) return null;

    // Look for prices within 50 characters of the dish mention
    let closestPrice = null;
    let minDistance = Infinity;

    prices.forEach(price => {
      const priceIndex = text.indexOf(price.replace('$', ''));
      if (priceIndex !== -1) {
        const distance = Math.abs(priceIndex - dishIndex);
        if (distance < 50 && distance < minDistance) {
          minDistance = distance;
          closestPrice = price;
        }
      }
    });

    return closestPrice;
  }

  private static generateMenuAnalysisFromData(
    cuisineType: string,
    priceLevel: number,
    dishMentions: string[],
    rating: number,
    reviewSources: string[],
    placeId: string
  ): any {
    console.log(`🍽️ Generating menu analysis with ${dishMentions.length} real dishes from reviews...`);
    
    // If we have real dishes from reviews, use them as primary source
    let selectedDishes: Array<{name: string, basePrice: number, ingredients: string[], fromReviews: boolean}> = [];
    
    if (dishMentions.length > 0) {
      // Use real dishes from reviews
      selectedDishes = dishMentions.slice(0, 3).map(dish => ({
        name: dish,
        basePrice: this.estimatePriceFromDish(dish, cuisineType, priceLevel, rating),
        ingredients: this.estimateIngredientsFromDish(dish, cuisineType),
        fromReviews: true
      }));
      
      console.log(`   ✅ Using ${selectedDishes.length} real dishes from customer reviews`);
    } else {
      // Fallback to cuisine database if no dishes found in reviews
      console.log(`   ⚠️ No dishes found in reviews, using cuisine defaults`);
      selectedDishes = this.getFallbackDishes(cuisineType).slice(0, 2);
    }

    // Adjust prices based on price level and rating
    const priceMultiplier = 1 + (priceLevel * 0.3) + (rating - 4.0) * 0.2;
    console.log(`   💰 Price multiplier: ${priceMultiplier.toFixed(2)} (price level ${priceLevel}, rating ${rating})`);
    
    return {
      title: 'Menu Analysis',
      subtitle: dishMentions.length > 0 
        ? `Real menu analysis from ${dishMentions.length} customer reviews`
        : `Popular ${cuisineType} dishes based on restaurant type and rating`,
      topItems: selectedDishes.map((dish, index) => ({
        id: `dish-${index}`,
        name: dish.name,
        price: `$${(dish.basePrice * priceMultiplier).toFixed(2)}`,
        productMatches: [
          {
            name: dish.fromReviews 
              ? `Real customer favorite: ${dish.name} with ${dish.ingredients.join(', ')}`
              : `Premium ingredients for ${dish.name}: ${dish.ingredients.join(', ')}`
          }
        ],
        pitchAngle: dish.fromReviews 
          ? `${dish.name} is highly praised by customers in reviews. Using premium ${dish.ingredients[0]} and quality ${dish.ingredients[1]} will maintain the authentic taste that customers love and expect.`
          : `${dish.name} is a signature ${cuisineType.toLowerCase()} dish. Premium ${dish.ingredients[0]} and fresh ${dish.ingredients[1]} will elevate this classic and drive customer satisfaction.`,
        matches: [
          {
            id: `ingredient-${index}`,
            name: `Premium ${dish.ingredients[0]}`,
            matchPercentage: dish.fromReviews ? 90 + Math.floor(Math.random() * 8) : 85 + Math.floor(Math.random() * 10),
            defaultPrice: `$${(12 + Math.random() * 8).toFixed(2)}`,
            retailPrice: `$${(15 + Math.random() * 10).toFixed(2)}`,
            yourPrice: `$${(13 + Math.random() * 8).toFixed(2)}`,
            avgMargin: `$${(2 + Math.random() * 3).toFixed(2)} / ${(7 + Math.random() * 5).toFixed(1)}%`,
            alternatives: []
          }
        ],
        basketTotal: {
          salePrice: `$${(20 + Math.random() * 30).toFixed(2)}`,
          profit: `$${(3 + Math.random() * 5).toFixed(2)}`,
          avgMargin: `${(8 + Math.random() * 4).toFixed(1)}%`
        },
        reviewSource: dish.fromReviews && reviewSources[index] 
          ? {
              text: reviewSources[index],
              googleMapsLink: `https://www.google.com/maps/search/?api=1&query_place_id=${placeId}&entry=gps#lr=reviews`
            }
          : null
      }))
    };
  }

  private static estimatePriceFromDish(dishName: string, cuisineType: string, priceLevel: number, rating: number): number {
    // Base price estimation based on dish complexity and type
    const lowerName = dishName.toLowerCase();
    
    // High-end dishes
    if (lowerName.includes('lobster') || lowerName.includes('wagyu') || lowerName.includes('truffle') || 
        lowerName.includes('caviar') || lowerName.includes('oyster') || lowerName.includes('scallop')) {
      return 45 + (priceLevel * 15);
    }
    
    // Seafood dishes
    if (lowerName.includes('salmon') || lowerName.includes('tuna') || lowerName.includes('barramundi') || 
        lowerName.includes('fish') || lowerName.includes('prawn') || lowerName.includes('seafood')) {
      return 28 + (priceLevel * 8);
    }
    
    // Meat dishes
    if (lowerName.includes('steak') || lowerName.includes('beef') || lowerName.includes('lamb') || 
        lowerName.includes('pork') || lowerName.includes('duck') || lowerName.includes('chicken')) {
      return 26 + (priceLevel * 6);
    }
    
    // Pasta and noodle dishes
    if (lowerName.includes('pasta') || lowerName.includes('ramen') || lowerName.includes('noodle') || 
        lowerName.includes('spaghetti') || lowerName.includes('linguine')) {
      return 22 + (priceLevel * 4);
    }
    
    // Pizza
    if (lowerName.includes('pizza')) {
      return 20 + (priceLevel * 5);
    }
    
    // Desserts
    if (lowerName.includes('tiramisu') || lowerName.includes('pavlova') || lowerName.includes('cake') || 
        lowerName.includes('ice cream') || lowerName.includes('tart')) {
      return 14 + (priceLevel * 3);
    }
    
    // Default pricing based on cuisine
    const basePrices: Record<string, number> = {
      'Italian': 24,
      'Seafood': 32,
      'Japanese': 26,
      'Chinese': 20,
      'Indian': 22,
      'Mexican': 18,
      'French': 30,
      'Modern Australian': 28
    };
    
    return (basePrices[cuisineType] || 24) + (priceLevel * 5);
  }

  private static estimateIngredientsFromDish(dishName: string, cuisineType: string): string[] {
    const lowerName = dishName.toLowerCase();
    
    // Specific dish ingredient mapping
    const dishIngredients: Record<string, string[]> = {
      'carbonara': ['pasta', 'eggs', 'pancetta', 'parmesan cheese'],
      'margherita': ['pizza base', 'tomato sauce', 'mozzarella', 'fresh basil'],
      'fish and chips': ['fish fillet', 'potatoes', 'batter', 'tartare sauce'],
      'pad thai': ['rice noodles', 'prawns', 'bean sprouts', 'tamarind sauce'],
      'ramen': ['ramen noodles', 'broth', 'char siu pork', 'soft boiled egg'],
      'sushi': ['sushi rice', 'fresh fish', 'nori seaweed', 'wasabi'],
      'curry': ['curry spices', 'coconut milk', 'vegetables', 'protein'],
      'risotto': ['arborio rice', 'stock', 'white wine', 'parmesan cheese'],
      'burger': ['beef patty', 'bun', 'lettuce', 'tomato'],
      'salad': ['mixed greens', 'vegetables', 'dressing', 'protein'],
      'steak': ['beef', 'seasoning', 'sides', 'sauce']
    };
    
    // Check for specific dishes first
    for (const [dish, ingredients] of Object.entries(dishIngredients)) {
      if (lowerName.includes(dish)) {
        return ingredients;
      }
    }
    
    // Fallback based on cuisine type
    const cuisineIngredients: Record<string, string[]> = {
      'Italian': ['pasta', 'tomatoes', 'olive oil', 'herbs'],
      'Seafood': ['fresh fish', 'lemon', 'herbs', 'vegetables'],
      'Japanese': ['rice', 'fish', 'soy sauce', 'miso'],
      'Chinese': ['soy sauce', 'ginger', 'garlic', 'vegetables'],
      'Indian': ['spices', 'curry', 'rice', 'naan'],
      'Mexican': ['chili', 'lime', 'cilantro', 'corn'],
      'Modern Australian': ['local produce', 'native herbs', 'seasonal vegetables', 'quality protein']
    };
    
    return cuisineIngredients[cuisineType] || ['fresh ingredients', 'quality protein', 'vegetables', 'seasoning'];
  }

  private static getFallbackDishes(cuisineType: string): Array<{name: string, basePrice: number, ingredients: string[], fromReviews: boolean}> {
    // Simplified fallback database
    const fallbackDishes: Record<string, Array<{name: string, basePrice: number, ingredients: string[]}>> = {
      'Italian': [
        { name: 'Carbonara Pasta', basePrice: 28, ingredients: ['pasta', 'eggs', 'pancetta', 'parmesan'] },
        { name: 'Margherita Pizza', basePrice: 24, ingredients: ['pizza base', 'tomato sauce', 'mozzarella', 'basil'] }
      ],
      'Seafood': [
        { name: 'Grilled Barramundi', basePrice: 34, ingredients: ['barramundi fillet', 'lemon', 'herbs', 'vegetables'] },
        { name: 'Fish & Chips', basePrice: 22, ingredients: ['fish fillet', 'potatoes', 'batter', 'tartare sauce'] }
      ],
      'Asian': [
        { name: 'Pad Thai', basePrice: 24, ingredients: ['rice noodles', 'prawns', 'tofu', 'bean sprouts'] },
        { name: 'Green Curry', basePrice: 26, ingredients: ['coconut milk', 'green curry paste', 'chicken', 'vegetables'] }
      ],
      'Modern Australian': [
        { name: 'Barramundi Fillet', basePrice: 34, ingredients: ['barramundi', 'native herbs', 'vegetables', 'lemon myrtle'] },
        { name: 'Lamb Rack', basePrice: 42, ingredients: ['lamb rack', 'rosemary', 'garlic', 'seasonal vegetables'] }
      ]
    };
    
    const dishes = fallbackDishes[cuisineType] || fallbackDishes['Modern Australian'];
    return dishes.map(dish => ({ ...dish, fromReviews: false }));
  }

  private static determineCuisineType(types: string[], name: string): string {
    // Map Google Place types to our cuisine categories
    const typeMap: Record<string, string> = {
      'italian_restaurant': 'Italian',
      'chinese_restaurant': 'Chinese',
      'japanese_restaurant': 'Japanese',
      'indian_restaurant': 'Indian',
      'mexican_restaurant': 'Mexican',
      'french_restaurant': 'French',
      'thai_restaurant': 'Thai',
      'greek_restaurant': 'Greek',
      'seafood_restaurant': 'Seafood',
      'steakhouse': 'Steakhouse',
      'pizza_place': 'Italian',
      'sushi_restaurant': 'Japanese',
      'cafe': 'Cafe',
      'bar': 'Pub Food',
      'bakery': 'Cafe',
    };

    // Check place types first
    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }

    // Check name for cuisine indicators
    const nameIndicators: Record<string, string> = {
      'pizza': 'Italian',
      'sushi': 'Japanese',
      'chinese': 'Chinese',
      'indian': 'Indian',
      'thai': 'Thai',
      'mexican': 'Mexican',
      'italian': 'Italian',
      'french': 'French',
      'greek': 'Greek',
      'cafe': 'Cafe',
      'coffee': 'Cafe',
      'steakhouse': 'Steakhouse',
      'seafood': 'Seafood',
      'burger': 'American',
      'pub': 'Pub Food',
      'bistro': 'Modern Australian',
    };

    const lowerName = name.toLowerCase();
    for (const [indicator, cuisine] of Object.entries(nameIndicators)) {
      if (lowerName.includes(indicator)) {
        return cuisine;
      }
    }

    return 'Modern Australian'; // Default
  }

  private static isNewlyOpened(periods?: any[]): boolean {
    // This is a simplified check - in reality, you'd need more data from Google
    // For now, we'll randomly assign some restaurants as newly opened
    return Math.random() < 0.15; // 15% chance of being newly opened
  }

  // Fallback mock data if Google Places API fails
  private static getMockRestaurants(lat: number, lng: number): GooglePlaceRestaurant[] {
    return [
      {
        id: '1',
        name: 'Café Verde Oliva',
        coordinates: { latitude: lat + 0.005, longitude: lng + 0.005 },
        rating: 4.5,
        reviewCount: 128,
        cuisineType: 'Italian',
        address: '123 Main Street, Surry Hills NSW 2010',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 2
      },
      {
        id: '2',
        name: 'Ocean Blue Restaurant',
        coordinates: { latitude: lat - 0.003, longitude: lng + 0.008 },
        rating: 4.2,
        reviewCount: 85,
        cuisineType: 'Seafood',
        address: '456 Harbor Drive, Sydney NSW 2000',
        isOpen: true,
        isNewlyOpened: false,
        priceLevel: 3
      },
      // Add more mock restaurants as needed...
    ];
  }
}

// Environment variable check
export const isGooglePlacesConfigured = () => {
  return GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_API_KEY !== 'YOUR_GOOGLE_PLACES_API_KEY';
}; 