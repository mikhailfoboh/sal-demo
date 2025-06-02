import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface TagProps {
  text: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export function Tag({ text, type = 'default', style }: TagProps) {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return colors.successLight;
      case 'warning': return colors.warningLight;
      case 'error': return colors.errorLight;
      case 'info': return colors.infoLight;
      default: return colors.defaultTagBackground;
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'info': return colors.info;
      default: return colors.textSecondary;
    }
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: getBackgroundColor(),
        },
        style
      ]}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});