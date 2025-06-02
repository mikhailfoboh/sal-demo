'use client';

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { WebNavigation } from '@/components/ui/WebNavigation';
import { useParams } from 'next/navigation';

function CustomerDetailScreen() {
  const params = useParams();
  const customerId = params?.id as string;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Inter-SemiBold', marginBottom: 10 }}>
          Customer Details
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>
          Customer ID: {customerId}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 10, textAlign: 'center' }}>
          This page would show detailed customer information, order history, and interaction logs.
        </Text>
      </View>
      <WebNavigation currentPath="/customers" />
    </View>
  );
}

export default function CustomerDetailPage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <CustomerDetailScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 