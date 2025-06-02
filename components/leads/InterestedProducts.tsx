import { StyleSheet, View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ShoppingBag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Product {
  id: string;
  name: string;
  details: string;
}

interface InterestedProductsProps {
  products: Product[];
}

export function InterestedProducts({ products }: InterestedProductsProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ShoppingBag size={20} color={colors.textSecondary} />
        <Text style={styles.title}>Interested Products</Text>
      </View>
      
      {products.map((product) => (
        <View key={product.id} style={styles.productItem}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDetails}>{product.details}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  productItem: {
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
  productDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
});