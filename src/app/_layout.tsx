import './global.css';
import { useFonts } from 'expo-font';
import React from 'react';
import { GluestackUIProvider } from '@/components/ui';
import 'react-native-reanimated';
import { ErrorBoundaryProps, Slot, SplashScreen } from 'expo-router';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';

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
	React.useEffect(() => {
		SplashScreen.hideAsync();
	}, []);
	if (!loaded && !error) {
		return null;
	}
	return (
		<>
			<ThemeProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<GluestackUIProvider>
						<Slot />
					</GluestackUIProvider>
				</GestureHandlerRootView>
			</ThemeProvider>
		</>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
