import './global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { GluestackUIProvider } from '@/components/ui';
import 'react-native-reanimated';
import { ErrorBoundaryProps, Slot } from 'expo-router';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				await new Promise((resolve) => setTimeout(resolve, 500));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = useCallback(() => {
		if (appIsReady) {
			SplashScreen.hide();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	return (
		<>
			<ThemeProvider>
				<GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
					<GluestackUIProvider>
						<BottomSheetModalProvider>
							<Slot />
						</BottomSheetModalProvider>
					</GluestackUIProvider>
				</GestureHandlerRootView>
			</ThemeProvider>
		</>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
