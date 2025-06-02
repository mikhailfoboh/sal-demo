import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Clipboard, Search, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface EmptyStateProps {
  icon?: 'clipboard' | 'search' | 'alert';
  title: string;
  message: string;
}

export function EmptyState({ icon = 'clipboard', title, message }: EmptyStateProps) {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (icon) {
      case 'clipboard':
        return <Clipboard size={32} color={colors.textSecondary} />;
      case 'search':
        return <Search size={32} color={colors.textSecondary} />;
      case 'alert':
        return <AlertCircle size={32} color={colors.textSecondary} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
        {getIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
  },
});