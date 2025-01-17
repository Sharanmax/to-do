import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoProvider } from '@/context/TodoContext';
import { useColorScheme } from '@/components/useColorScheme';
import ResponsiveWrapper from './responsiveWrapper';

// Create a context to manage login state across the app
export const AuthContext = createContext<{
  isLoggedIn: boolean | null;
  setIsLoggedIn: (loggedIn: boolean) => void;
}>({
  isLoggedIn: null, // Initial state is `null` to represent the loading state
  setIsLoggedIn: () => { },
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login', // Default to login screen
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Check login status and update state
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log("cehck token at rooot ", token)
        setIsLoggedIn(token === 'mockToken'); // Set login state based on token
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false); // Default to logged out on error
      }
    };

    checkLoginStatus();
  }, []); // Run only once on mount

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || isLoggedIn === null) {
    // Show a loading spinner while fonts or login state are being resolved
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  console.log("Check logged in at root level: ", isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <RootLayoutNav />
    </AuthContext.Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useContext(AuthContext); // Use the AuthContext here

  console.log("Check logged in state in navigation: ", isLoggedIn);

  // Show a loading spinner while login state is being resolved
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <TodoProvider>
      <ThemeProvider value={DarkTheme}>
        <ResponsiveWrapper>
          <Stack screenOptions={{ headerShown: false }}>
            {isLoggedIn && !isLoggedIn ? (
              <Stack.Screen name="login" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )}
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ResponsiveWrapper>
      </ThemeProvider>
    </TodoProvider>
  );
}