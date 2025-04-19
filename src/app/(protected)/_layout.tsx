import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export default function ProtectedRoutesLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerBackVisible: true,
				statusBarStyle: 'auto',
			}}
		/>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
