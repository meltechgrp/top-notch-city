import './global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GluestackUIProvider } from '../components/ui';
import 'react-native-reanimated';
import * as Linking from 'expo-linking';
import { ErrorBoundaryProps, Slot, Stack } from 'expo-router';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		'Railway-Black': require('../assets/fonts/Raleway-Black.ttf'),
		'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
		'Raleway-ExtraBold': require('../assets/fonts/Raleway-ExtraBold.ttf'),
		'Raleway-Light': require('../assets/fonts/Raleway-Light.ttf'),
		'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
		'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),
		'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),
		'Raleway-Thin': require('../assets/fonts/Raleway-Thin.ttf'),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<>
			{/* <ThemeContext.Provider value={{ colorMode, toggleColorMode }}> */}
			<GestureHandlerRootView style={{ flex: 1 }}>
				<GluestackUIProvider mode={'light'} style={{ flex: 1 }}>
					<ClerkProvider tokenCache={tokenCache}>
						<Slot />
					</ClerkProvider>
					<StatusBar style="auto" />
				</GluestackUIProvider>
			</GestureHandlerRootView>
			{/* </ThemeContext.Provider> */}
		</>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
