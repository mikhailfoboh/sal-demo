'use client';

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { WebNavigation } from '@/components/ui/WebNavigation';

function VoiceNoteScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Inter-SemiBold', marginBottom: 10 }}>
          Voice Notes
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 10, textAlign: 'center' }}>
          This page would allow users to record voice notes and transcribe them.
        </Text>
      </View>
      <WebNavigation currentPath="/notes" />
    </View>
  );
}

export default function VoiceNotePage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <VoiceNoteScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 