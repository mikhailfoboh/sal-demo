import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Tag } from '@/components/ui/Tag';

interface CustomerHeaderProps {
  name: string;
  segment: string;
  healthStatus: 'healthy' | 'attention' | 'at-risk' | 'inactive';
  churnRisk?: string;
}

export function CustomerHeader({ name, segment, healthStatus, churnRisk }: CustomerHeaderProps) {
  const { colors } = useTheme();

  const getHealthTag = () => {
    switch (healthStatus) {
      case 'healthy': return <Tag text="Healthy" type="success" />;
      case 'attention': return <Tag text="Attention" type="warning" />;
      case 'at-risk': return <Tag text="At Risk" type="warning" />;
      case 'inactive': return <Tag text="Inactive" type="error" />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {getHealthTag()}
          </View>
          <Text style={styles.segment}>{segment}</Text>
        </View>
      </View>
      
      {(healthStatus === 'at-risk' || healthStatus === 'attention') && churnRisk && (
        <View style={[styles.riskAlert, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.riskText, { color: colors.warning }]}>
            {churnRisk}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#111827',
  },
  segment: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  riskAlert: {
    padding: 12,
    borderRadius: 8,
  },
  riskText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});