'use client';

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Chrome as Home, Target, Users, ClipboardList } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface WebNavigationProps {
  currentPath?: string;
}

export function WebNavigation({ currentPath = '/' }: WebNavigationProps) {
  const { colors } = useTheme();

  const navigationItems = [
    { key: 'plan', title: 'Plan', icon: Home, path: '/' },
    { key: 'leads', title: 'Leads', icon: Target, path: '/leads' },
    { key: 'customers', title: 'Customers', icon: Users, path: '/customers' },
    { key: 'notes', title: 'Notes', icon: ClipboardList, path: '/notes' },
  ];

  const handleNavigation = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath?.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => handleNavigation(item.path)}
          >
            <Icon 
              size={24} 
              color={active ? colors.primary : colors.textSecondary} 
            />
            <Text 
              style={[
                styles.navLabel,
                { color: active ? colors.primary : colors.textSecondary }
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 0.5,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 4,
  },
}); 