import { useTheme } from '@/components/layouts/ThemeProvider';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export default function ProtectedRoutesLayout() {
	const { theme } = useTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
				animationDuration: 1000,
				animationTypeForReplace: 'push',
				headerTitleAlign: 'center',
				animation: 'slide_from_right',
				headerBackVisible: true,
				statusBarStyle: theme == 'dark' ? 'light' : 'dark',
			}}>
			<Stack.Screen
				name="search"
				options={{
					animation: 'fade',
					headerShown: false,
				}}
			/>
		</Stack>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
