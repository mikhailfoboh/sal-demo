'use client';

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { WebNavigation } from '@/components/ui/WebNavigation';
import { useParams } from 'next/navigation';

function LeadDetailScreen() {
  const params = useParams();
  const leadId = params?.id as string;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Inter-SemiBold', marginBottom: 10 }}>
          Lead Details
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>
          Lead ID: {leadId}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 10, textAlign: 'center' }}>
          This page would show detailed lead information, contact details, and follow-up actions.
        </Text>
      </View>
      <WebNavigation currentPath="/leads" />
    </View>
  );
}

export default function LeadDetailPage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <LeadDetailScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 