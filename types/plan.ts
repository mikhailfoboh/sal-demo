export interface Plan {
  id: string;
  date: string;
  visits: {
    id: string;
    customerId: string;
    customerName: string;
    time: string;
    duration: string;
    notes?: string;
    location?: string;
    completed: boolean;
    priority?: 'high' | 'medium' | 'low';
  }[];
  tasks: {
    id: string;
    title: string;
    description?: string;
    time?: string;
    completed: boolean;
    customerId?: string;
    customerName?: string;
    leadId?: string;
    leadName?: string;
    priority?: 'high' | 'medium' | 'low';
  }[];
}