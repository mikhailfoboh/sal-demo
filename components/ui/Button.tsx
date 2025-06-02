import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon
}: ButtonProps) {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled) return colors.disabledBackground;
    
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.primary;
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return colors.disabledBackground;
    
    switch (variant) {
      case 'outline': return colors.border;
      case 'secondary': return colors.secondary;
      default: return 'transparent';
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.disabledText;
    
    switch (variant) {
      case 'primary': return colors.buttonText;
      case 'secondary': return colors.primary;
      case 'outline': return colors.primary;
      case 'ghost': return colors.primary;
      default: return colors.buttonText;
    }
  };
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small': return styles.buttonSmall;
      case 'large': return styles.buttonLarge;
      default: return styles.buttonMedium;
    }
  };
  
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small': return styles.textSmall;
      case 'large': return styles.textLarge;
      default: return styles.textMedium;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              getTextSizeStyle(),
              { color: getTextColor() },
              leftIcon && styles.textWithLeftIcon,
              rightIcon && styles.textWithRightIcon,
              textStyle
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  textWithLeftIcon: {
    marginLeft: 8,
  },
  textWithRightIcon: {
    marginRight: 8,
  },
});