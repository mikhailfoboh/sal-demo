import { useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  address: string;
  isOpen: boolean;
  priceLevel: number;
}

interface Lead {
  id: string;
  restaurantName: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  primaryContact: string;
  status: 'potential' | 'contacted' | 'qualified' | 'unqualified';
  notes: string;
  productMatches: Array<{
    id: string;
    productName: string;
    category: string;
    matchPercentage: number;
    estimatedMonthlyValue: number;
    margin: number;
    alternatives: Array<{
      id: string;
      productName: string;
      category: string;
      matchPercentage: number;
      estimatedMonthlyValue: number;
      margin: number;
    }>;
  }>;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  totalEstimatedValue: number;
  averageMargin: number;
}

export const useRestaurantScraper = () => {
  const [isLoading, setIsLoading] = useState(false);

  const convertRestaurantToLead = (restaurant: Restaurant): Lead => {
    // Generate mock product matches based on cuisine type
    const getProductMatches = (cuisineType: string) => {
      const productCategories = {
        Italian: {
          primary: { name: 'Organic Pasta', category: 'pasta', match: 95, value: 850, margin: 22 },
          alternatives: [
            { name: 'Premium Semolina Pasta', category: 'pasta', match: 88, value: 720, margin: 18 },
            { name: 'Artisan Fresh Pasta', category: 'pasta', match: 92, value: 950, margin: 28 },
            { name: 'Gluten-Free Pasta Range', category: 'pasta', match: 75, value: 680, margin: 25 }
          ]
        },
        Seafood: {
          primary: { name: 'Premium Fish Selection', category: 'fish', match: 90, value: 1200, margin: 30 },
          alternatives: [
            { name: 'Sustainable Catch Daily', category: 'fish', match: 85, value: 1050, margin: 25 },
            { name: 'Fresh Shellfish Variety', category: 'seafood', match: 88, value: 1350, margin: 35 },
            { name: 'Frozen Premium Seafood', category: 'seafood', match: 70, value: 900, margin: 20 }
          ]
        },
        Asian: {
          primary: { name: 'Asian Spice Collection', category: 'spices', match: 92, value: 450, margin: 40 },
          alternatives: [
            { name: 'Fresh Asian Vegetables', category: 'vegetables', match: 85, value: 380, margin: 18 },
            { name: 'Premium Soy Products', category: 'condiments', match: 80, value: 320, margin: 45 },
            { name: 'Authentic Noodle Varieties', category: 'noodles', match: 88, value: 550, margin: 22 }
          ]
        },
        default: {
          primary: { name: 'Fresh Produce Mix', category: 'vegetables', match: 75, value: 650, margin: 20 },
          alternatives: [
            { name: 'Organic Herb Selection', category: 'herbs', match: 70, value: 280, margin: 35 },
            { name: 'Quality Meat Cuts', category: 'meat', match: 80, value: 800, margin: 25 },
            { name: 'Dairy Essentials', category: 'dairy', match: 65, value: 420, margin: 15 }
          ]
        }
      };

      const config = productCategories[cuisineType as keyof typeof productCategories] || productCategories.default;
      
      return [{
        id: `${restaurant.id}-primary`,
        productName: config.primary.name,
        category: config.primary.category,
        matchPercentage: config.primary.match,
        estimatedMonthlyValue: config.primary.value,
        margin: config.primary.margin,
        alternatives: config.alternatives.map((alt, index) => ({
          id: `${restaurant.id}-alt-${index}`,
          productName: alt.name,
          category: alt.category,
          matchPercentage: alt.match,
          estimatedMonthlyValue: alt.value,
          margin: alt.margin,
        }))
      }];
    };

    const productMatches = getProductMatches(restaurant.cuisineType);
    const totalValue = productMatches.reduce((sum, product) => sum + product.estimatedMonthlyValue, 0);
    const avgMargin = productMatches.reduce((sum, product) => sum + product.margin, 0) / productMatches.length;

    // Generate realistic contact info
    const generateContactInfo = (name: string) => {
      const domains = ['gmail.com', 'hotmail.com', 'restaurant.com', 'venue.com.au'];
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      return {
        email: `contact@${cleanName.substring(0, 8)}.${domain}`,
        phone: `+61 ${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
        contact: `${name.split(' ')[0]} Manager`
      };
    };

    const contactInfo = generateContactInfo(restaurant.name);

    return {
      id: `lead-${restaurant.id}-${Date.now()}`,
      restaurantName: restaurant.name,
      type: restaurant.cuisineType,
      address: restaurant.address,
      phone: contactInfo.phone,
      email: contactInfo.email,
      primaryContact: contactInfo.contact,
      status: 'potential',
      notes: `Added from map discovery. ${restaurant.rating} star rating (${restaurant.reviewCount} reviews). ${restaurant.isOpen ? 'Currently open' : 'Currently closed'}.`,
      productMatches,
      totalEstimatedValue: totalValue,
      averageMargin: Math.round(avgMargin * 100) / 100,
    };
  };

  const addRestaurantAsLead = async (restaurant: Restaurant): Promise<Lead> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLead = convertRestaurantToLead(restaurant);
      
      // In a real app, you would save this to your backend/storage
      console.log('New lead created:', newLead);
      
      return newLead;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    convertRestaurantToLead,
    addRestaurantAsLead
  };
}; 