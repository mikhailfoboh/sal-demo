import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Phone, CalendarPlus } from 'lucide-react-native';

interface ActionButtonsProps {
  onCall: () => void;
  onScheduleVisit: () => void;
}

export function ActionButtons({ onCall, onScheduleVisit }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Button
        title="Call"
        variant="secondary"
        style={styles.button}
        leftIcon={<Phone size={18} color="#4F46E5" />}
        onPress={onCall}
      />
      <Button
        title="Schedule Visit"
        variant="primary"
        style={styles.button}
        leftIcon={<CalendarPlus size={18} color="#FFFFFF" />}
        onPress={onScheduleVisit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
});