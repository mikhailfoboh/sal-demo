import { StyleSheet, View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Calendar } from 'lucide-react-native';
import { ActionItem } from '@/components/ui/ActionItem';
import { useTheme } from '@/hooks/useTheme';

interface Action {
  title: string;
  description: string;
  date: string;
  icon: string;
}

interface UpcomingActionsProps {
  actions: Action[];
  onActionPress: (action: Action) => void;
}

export function UpcomingActions({ actions, onActionPress }: UpcomingActionsProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Calendar size={20} color={colors.textSecondary} />
        <Text style={styles.title}>Upcoming Actions</Text>
      </View>
      <View style={styles.content}>
        {actions.map((action, index) => (
          <ActionItem
            key={index}
            title={action.title}
            description={action.description}
            date={action.date}
            onPress={() => onActionPress(action)}
          />
        ))}
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
});