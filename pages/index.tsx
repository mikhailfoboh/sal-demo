import React from 'react';
import Head from 'next/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import the plan screen directly instead of the full app
import PlanScreen from '../app/(tabs)/plan/index';

export default function WebApp() {
  return (
    <>
      <Head>
        <title>Foboh Sales App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SafeAreaProvider>
        <PlanScreen />
      </SafeAreaProvider>
    </>
  );
} 