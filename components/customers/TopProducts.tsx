import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Package } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Product {
  id: string;
  name: string;
  quantity: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const { colors } = useTheme();
  
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Package size={20} color={colors.textSecondary} />
        <Text style={styles.cardTitle}>Top Products</Text>
      </View>
      
      {products?.map((product) => (
        <View key={product.id} style={styles.productItem}>
          <View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQuantity}>{product.quantity} units</Text>
          </View>
          <Text style={[
            styles.trend,
            { color: product.trend === 'up' ? colors.success : product.trend === 'down' ? colors.error : colors.textSecondary }
          ]}>
            {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}
          </Text>
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
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  productName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  productQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  trend: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});