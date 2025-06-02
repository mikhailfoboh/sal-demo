import { useAppContext } from '@/context/AppContext';

export function useCustomers() {
  const { customers } = useAppContext();
  
  return {
    customers,
    isLoading: false
  };
}

export function useCustomerById(id: string | undefined) {
  const { customers } = useAppContext();
  
  const customer = customers.find(customer => customer.id === id);
  
  return {
    customer,
    isLoading: false
  };
}