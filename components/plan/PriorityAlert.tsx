import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { planStyles } from '@/styles/components/plan';

interface Priority {
  customerId: string;
  customerName: string;
  reason: string;
  action: string;
}

interface PriorityAlertProps {
  priority: Priority;
  onPress: () => void;
}

export function PriorityAlert({ priority, onPress }: PriorityAlertProps) {
  const { colors } = useTheme();
  
  return (
    <View style={planStyles.priorityAlert}>
      <View style={planStyles.priorityContent}>
        <View style={planStyles.priorityIconContainer}>
          {/* <AlertCircle size={20} color="#553402" /> */}
        </View>
        
        <View style={planStyles.priorityTextContainer}>
          <Text style={planStyles.priorityTitle}>{priority.customerName}</Text>
          <Text style={planStyles.priorityMessage}>{priority.reason}</Text>
        </View>
        
        <TouchableOpacity style={planStyles.priorityButton} onPress={onPress}>
          <Text style={planStyles.priorityButtonText}>{priority.action}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}