import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Clock, ArrowRight, Building2 } from 'lucide-react-native';
import { Customer } from '@/types/customer';

interface CustomerRowProps {
  customer: Customer;
  onPress: () => void;
}

export function CustomerRow({ customer, onPress }: CustomerRowProps) {
  const { colors } = useTheme();
  
  const getStatusColor = () => {
    switch (customer.healthStatus) {
      case 'healthy': return colors.success;
      case 'at-risk': return colors.warning;
      case 'inactive': return colors.error;
      default: return colors.textSecondary;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { borderBottomColor: colors.border }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{customer.name}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>
        
        <View style={styles.venueRow}>
          <Building2 size={14} color={colors.textSecondary} />
          <Text style={styles.venue}>{customer.segment}</Text>
        </View>
        
        <View style={styles.orderRow}>
          <Clock size={12} color={colors.textTertiary} />
          <Text style={styles.orderText}>
            Last order: {customer.lastOrder || 'Never'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <ArrowRight size={18} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#111827',
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  venue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 6,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});