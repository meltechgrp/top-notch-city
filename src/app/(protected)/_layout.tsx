import { useTheme } from '@/components/layouts/ThemeProvider';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export default function ProtectedRoutesLayout() {
	const { theme } = useTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerBackVisible: true,
				statusBarStyle: theme == 'dark' ? 'light' : 'dark',
			}}
		/>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
