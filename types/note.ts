export interface Note {
  id: string;
  content: string;
  date: string;
  type: string;
  customerId?: string;
  customerName?: string;
  leadId?: string;
  leadName?: string;
  location?: string;
  tags?: string[];
}