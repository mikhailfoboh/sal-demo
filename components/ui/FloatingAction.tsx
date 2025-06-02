import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Mic, PenLine, Users, Briefcase, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export function FloatingAction() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  const handleAction = (action: string) => {
    setIsOpen(false);
    
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
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.backdrop}>
          <TouchableOpacity 
            style={styles.backdropTouchable}
            onPress={() => setIsOpen(false)}
          />
        </View>
      )}
      
      {isOpen && (
        <View style={styles.actionsContainer}>
          <ActionButton
            icon={<Mic size={20} color="#FFFFFF" />}
            label="Voice Note"
            onPress={() => handleAction('voice')}
            backgroundColor="#DC2626"
          />
          <ActionButton
            icon={<PenLine size={20} color="#FFFFFF" />}
            label="Text Note"
            onPress={() => handleAction('note')}
            backgroundColor="#2563EB"
          />
          <ActionButton
            icon={<Briefcase size={20} color="#FFFFFF" />}
            label="Add Lead"
            onPress={() => handleAction('lead')}
            backgroundColor="#059669"
          />
          <ActionButton
            icon={<Users size={20} color="#FFFFFF" />}
            label="Schedule Visit"
            onPress={() => handleAction('visit')}
            backgroundColor="#9333EA"
          />
        </View>
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isOpen ? '#EF4444' : colors.primary }
        ]}
        onPress={handleToggle}
      >
        {isOpen ? (
          <X size={24} color="#FFFFFF" />
        ) : (
          <Plus size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  backgroundColor: string;
}

function ActionButton({ icon, label, onPress, backgroundColor }: ActionButtonProps) {
  return (
    <View style={styles.actionButtonContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor }]}
        onPress={onPress}
      >
        {icon}
      </TouchableOpacity>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    zIndex: 10,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  backdropTouchable: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#374151',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
});