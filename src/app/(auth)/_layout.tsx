import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, Stack } from 'expo-router';
export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'signin',
};

export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerBackVisible: true,
			}}
		/>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
