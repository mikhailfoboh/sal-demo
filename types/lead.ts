export interface Lead {
  id: string;
  name: string;
  venue: string;
  venueType: string;
  address: string;
  stage: string;
  createdAt: string;
  lastInteraction: string;
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