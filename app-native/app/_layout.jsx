import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, Text , StyleSheet } from 'react-native'; // Added View, Text to handle loading
import 'react-native-reanimated';
import { SocketProvider } from '../components/SocketContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WebView } from "react-native-webview";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
      <SocketProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="chatbot" />
            <Stack.Screen name="RecordingHistory" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="menu" />
            <Stack.Screen name="help" />
            <Stack.Screen name="language" />
            <Stack.Screen 
              name="friendLocation" 
              options={{ headerShown: true, title: "Friend's Location" }} 
            />
            <Stack.Screen 
              name="LocationHistory" 
              options={{ headerShown: true, title: "Location History" }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>


          <StatusBar style="auto" />
        </ThemeProvider>
      </SocketProvider>
  );
}

const styles = StyleSheet.create({
  translateContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 200, // Adjust the size as needed
    height: 100, // Adjust the size as needed
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  translateWebView: {
    flex: 1,
  },
});
