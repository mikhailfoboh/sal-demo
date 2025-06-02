import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import type { Customer } from '@/types/customer';

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
}

export function CustomerSelector({ customers, selectedCustomerId, onSelectCustomer }: CustomerSelectorProps) {
  return (
    <Card>
      {customers.map((customer) => (
        <TouchableOpacity
          key={customer.id}
          onPress={() => onSelectCustomer(customer.id)}
          style={[
            styles.customerRow,
            selectedCustomerId === customer.id && styles.selectedRow
          ]}
        >
          <View>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerAddress}>{customer.address}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  customerRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedRow: {
    backgroundColor: '#F0F9FF',
  },
  customerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#111827',
    marginBottom: 2,
  },
  customerAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
});