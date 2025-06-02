import { useAppContext } from '@/context/AppContext';

export function useLeads() {
  const { leads } = useAppContext();
  
  return {
    leads,
    isLoading: false
  };
}

export function useLeadById(id: string | undefined) {
  const { leads } = useAppContext();
  
  const lead = leads.find(lead => lead.id === id);
  
  return {
    lead,
    isLoading: false
  };
}