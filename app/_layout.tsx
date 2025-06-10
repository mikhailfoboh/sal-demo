import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Platform, useColorScheme, View } from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Set status bar style immediately
  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#087057', true);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#087057', flex: 1 }}>
        <SafeAreaProvider>
          <AppProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <StatusBar 
                barStyle="light-content"
                backgroundColor="#087057"
                translucent={false}
              />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="notes/[id]" />
                <Stack.Screen name="customers/[id]" />
                <Stack.Screen name="leads/[id]" />
                <Stack.Screen name="plan/add-visit" options={{ presentation: 'modal' }} />
                <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
              </Stack>
            </ThemeProvider>
          </AppProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}