import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SocketProvider } from '../components/SocketContext';
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

  if (!loaded) {
    return null;
  }

  return (
    <SocketProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
          <Stack options={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }}  />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
            <Stack.Screen name="login" options={{ headerShown: false }}  /> 
            <Stack.Screen name="otp" options={{ headerShown: false }} />
            <Stack.Screen name="chatbot" options={{ headerShown: false }} />
            <Stack.Screen name="friendLocation" options={{ 
              headerShown: true,
              title: "Friend's Location"
            }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
      </ThemeProvider>
    </SocketProvider>
  );
}
