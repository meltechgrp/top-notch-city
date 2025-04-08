import './global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GluestackUIProvider, SafeAreaView } from '../components/ui';
import 'react-native-reanimated';
import * as Linking from 'expo-linking';
import { ErrorBoundaryProps, Slot, Stack } from 'expo-router';
import AppCrashScreen from '@/components/shared/AppCrashScreen';

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
			<GluestackUIProvider mode={'light'} style={{ flex: 1 }}>
				<Slot />
				<StatusBar style="auto" />
			</GluestackUIProvider>
			{/* </ThemeContext.Provider> */}
		</>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
