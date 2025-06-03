import { useMemo } from 'react';

export function useTheme() {
  const colors = useMemo(() => {
    return {
      // Primary colors
      primary: '#087057', // Green
      primaryLight: '#E8F5F1',
      primaryDark: '#065A47',
      
      // Secondary colors
      secondary: '#E8F5F1',
      secondaryLight: '#F0F7F4',
      secondaryDark: '#C6E1D5',
      
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
  }, []);
  
  return { colors };
}