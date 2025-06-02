import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ShoppingBag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Order {
  id: string;
  date: string;
  amount: number;
  status: string;
  items: number;
}

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const { colors } = useTheme();
  
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <ShoppingBag size={20} color={colors.textSecondary} />
        <Text style={styles.cardTitle}>Order History</Text>
      </View>
      
      {orders?.map((order) => (
        <View key={order.id} style={styles.orderItem}>
          <View>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderItems}>{order.items} items</Text>
          </View>
          <View>
            <Text style={styles.orderTotal}>${order.amount.toFixed(2)}</Text>
            <Text style={[styles.orderStatus, { color: colors.primary }]}>
              {order.status}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  orderDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  orderItems: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  orderTotal: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111827',
    textAlign: 'right',
    marginBottom: 2,
  },
  orderStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    textAlign: 'right',
  },
});