import { StyleSheet, View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Building2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface VenueInfoProps {
  venueType: string;
  address: string;
}

export function VenueInfo({ venueType, address }: VenueInfoProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Building2 size={20} color={colors.textSecondary} />
        <Text style={styles.title}>Venue Information</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.venueType}>{venueType}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
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
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  content: {
    marginTop: 4,
  },
  venueType: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});