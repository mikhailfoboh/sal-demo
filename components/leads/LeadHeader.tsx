import { StyleSheet, View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Tag } from '@/components/ui/Tag';

interface LeadHeaderProps {
  name: string;
  venue: string;
  stage: string;
  lastInteraction: string;
}

export function LeadHeader({ name, venue, stage, lastInteraction }: LeadHeaderProps) {
  const { colors } = useTheme();

  const getStageTag = () => {
    switch (stage) {
      case 'New': return <Tag text="New" type="default" />;
      case 'Contacted': return <Tag text="Contacted" type="info" />;
      case 'Sampling': return <Tag text="Sampling" type="warning" />;
      case 'Won': return <Tag text="Won" type="success" />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {getStageTag()}
          </View>
          <Text style={styles.venue}>{venue}</Text>
        </View>
      </View>
      
      <View style={styles.lastInteraction}>
        <Clock size={14} color={colors.textSecondary} />
        <Text style={styles.lastInteractionText}>
          Last interaction: {lastInteraction}
        </Text>
      </View>
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
    marginBottom: 12,
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
  venue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  lastInteraction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastInteractionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
});