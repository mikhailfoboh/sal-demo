import { StyleSheet } from 'react-native';

export const colors = {
  // Primary colors
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  
  // Secondary colors
  secondary: '#EEF2FF',
  secondaryLight: '#F5F3FF',
  secondaryDark: '#C7D2FE',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  buttonText: '#FFFFFF',
  disabledText: '#9CA3AF',
  
  // Background colors
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
  disabledBackground: '#E5E7EB',
  
  // Status colors
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
  
  // Utility colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  shadow: '#000000',
  
  // Tag backgrounds
  defaultTagBackground: '#F3F4F6',
};

export const typography = {
  h1: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  h2: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  h3: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  body1: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
  },
  body2: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
  },
  button: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  small: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const layout = {
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  shadow: {
    sm: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
}; 