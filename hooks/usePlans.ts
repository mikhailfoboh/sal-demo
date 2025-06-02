import { useAppContext } from '@/context/AppContext';

export function usePlans() {
  const { plans, priorities } = useAppContext();
  
  return {
    plans,
    priorities,
    isLoading: false
  };
}