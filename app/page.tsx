'use client';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import PlanScreen from './(tabs)/plan/index';

export default function HomePage() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <PlanScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
} 