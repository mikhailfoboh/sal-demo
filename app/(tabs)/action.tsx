import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mic, PenLine, Users, Briefcase } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function ActionScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleAction = (action: string) => {
    switch (action) {
      case 'voice':
        router.push('/(tabs)/notes/voice' as any);
        break;
      case 'note':
        router.push('/(tabs)/notes/add' as any);
        break;
      case 'lead':
        router.push('/(tabs)/leads/add' as any);
        break;
      case 'visit':
        router.push('/(tabs)/plan/add-visit' as any);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Actions</Text>
        <Text style={styles.subtitle}>Choose an action to get started</Text>
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FEF2F2' }]}
          onPress={() => handleAction('voice')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#DC2626' }]}>
            <Mic size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Voice Note</Text>
          <Text style={styles.actionDescription}>Record audio notes quickly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#EFF6FF' }]}
          onPress={() => handleAction('note')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#2563EB' }]}>
            <PenLine size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Text Note</Text>
          <Text style={styles.actionDescription}>Write detailed notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#ECFDF5' }]}
          onPress={() => handleAction('lead')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#059669' }]}>
            <Briefcase size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Add Lead</Text>
          <Text style={styles.actionDescription}>Create new business lead</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FAF5FF' }]}
          onPress={() => handleAction('visit')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
            <Users size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Schedule Visit</Text>
          <Text style={styles.actionDescription}>Plan customer meeting</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsGrid: {
    flex: 1,
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
}); 