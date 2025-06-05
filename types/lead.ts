export interface Lead {
  id: string;
  name: string;
  venue: string;
  venueType: string;
  address: string;
  stage: string;
  createdAt: string;
  lastInteraction: string;
  
  // Venue Analysis Fields
  isNew?: boolean;
  location?: string;
  category?: string;
  bestTime?: string;
  rating?: number;
  reviewCount?: number;
  recentReview?: {
    date: string;
    text: string;
    rating: number;
    reviewCount: number;
  };
  menuAnalysis?: {
    title: string;
    subtitle: string;
    topItems: {
      id: string;
      name: string;
      price: string;
      productMatches: {
        name: string;
      }[];
      pitchAngle: string;
      matches: {
        id: string;
        name: string;
        matchPercentage: number;
        defaultPrice: string;
        retailPrice: string;
        yourPrice: string;
        avgMargin: string;
      }[];
      basketTotal: {
        salePrice: string;
        profit: string;
        avgMargin: string;
      };
    }[];
  };
  
  interestedSkus: {
    id: string;
    name: string;
    details: string;
  }[];
  suggestedActions: {
    title: string;
    description: string;
    icon: string;
  }[];
  contact: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  notes: {
    id: string;
    date: string;
    content: string;
    type: string;
  }[];
}