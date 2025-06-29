import './global.css';
import React, { useEffect } from 'react';
import { GluestackUIProvider } from '@/components/ui';
import 'react-native-reanimated';
import { ErrorBoundaryProps, Slot } from 'expo-router';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
import GlobalManager from '@/components/shared/GlobalManager';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import * as Clarity from '@microsoft/react-native-clarity';

const query = new QueryClient();


// Initialize Microsoft Clarity
Clarity.initialize('s756k52ds5', {
  logLevel: Clarity.LogLevel.Verbose, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
});


export const unstable_settings = {
  initialRouteName: '(onboarding)/splash',
}
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useReactQueryDevTools(query);
	useEffect(() => {
		SplashScreen.hide();
	}, []);

	return (
		<>
			<QueryClientProvider client={query}>
				<ThemeProvider>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<GluestackUIProvider>
							<BottomSheetModalProvider>
								<Slot />
								<GlobalManager />
							</BottomSheetModalProvider>
						</GluestackUIProvider>
					</GestureHandlerRootView>
				</ThemeProvider>
			</QueryClientProvider>
		</>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
