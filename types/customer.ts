export interface Customer {
  id: string;
  name: string;
  segment: string;
  venueType: string;
  address: string;
  territory: string;
  healthStatus: 'healthy' | 'attention' | 'at-risk' | 'inactive';
  churnRisk?: string;
  lastOrder?: string;
  contact: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  orders: {
    id: string;
    date: string;
    amount: number;
    status: string;
    items: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    quantity: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  upcomingActions: {
    title: string;
    description: string;
    date: string;
    icon: string;
  }[];
  suggestedActions: {
    title: string;
    description: string;
    icon: string;
  }[];
  notes: {
    id: string;
    date: string;
    content: string;
    type: string;
  }[];
}