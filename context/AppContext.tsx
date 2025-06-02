import { createContext, useContext, ReactNode, useState } from 'react';
import { mockLeads } from '@/data/mockLeads';
import { mockCustomers } from '@/data/mockCustomers';
import { mockPlans } from '@/data/mockPlans';
import { mockNotes } from '@/data/mockNotes';
import { Lead } from '@/types/lead';
import { Customer } from '@/types/customer';
import { Plan } from '@/types/plan';
import { Note } from '@/types/note';

interface AppContextType {
  leads: Lead[];
  customers: Customer[];
  plans: Plan[];
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  priorities: any[];
  // Add state update functions as needed
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  
  // Simulated "priority" customers (at-risk)
  const priorities = customers
    .filter(customer => customer.healthStatus === 'at-risk')
    .map(customer => ({
      customerId: customer.id,
      customerName: customer.name,
      reason: customer.churnRisk,
      action: 'Call now'
    }));

  return (
    <AppContext.Provider
      value={{
        leads,
        customers,
        plans,
        notes,
        setNotes,
        priorities,
        // Add state update functions as needed
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}