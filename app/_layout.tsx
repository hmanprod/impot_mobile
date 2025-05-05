import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, View } from 'react'; // Import router
import 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';

import { useAuthentication } from '@/hooks/useAuthentication';
import { useColorScheme } from '@/hooks/useColorScheme';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { user, isLoading } = useAuthentication();

  useEffect(() => {
    // Redirect only when authentication status is determined and not loading
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to the main app
        router.replace('/(tabs)'); // Use router.replace for navigation
      } else {
        // User is not authenticated, redirect to the auth screen
        router.replace('/auth'); // Use router.replace for navigation
      }
    }
  }, [user, isLoading, loaded]); // Add loaded as a dependency

  if (!loaded || isLoading) {
    // Render a loading indicator while fonts are loading or authentication is in progress
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* You can add conditional rendering for screens within the Stack if needed */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} /> {/* Add auth screen to stack */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
