'use client';

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { WebNavigation } from '@/components/ui/WebNavigation';
import { useParams } from 'next/navigation';

function NoteDetailScreen() {
  const params = useParams();
  const noteId = params?.id as string;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Inter-SemiBold', marginBottom: 10 }}>
          Note Details
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>
          Note ID: {noteId}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 10, textAlign: 'center' }}>
          This page would show the full note content, attachments, and related information.
        </Text>
      </View>
      <WebNavigation currentPath="/notes" />
    </View>
  );
}

export default function NoteDetailPage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NoteDetailScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 