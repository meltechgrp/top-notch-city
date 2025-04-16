import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, Stack, Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'signin',
};

export default function AuthLayout() {
	const { isSignedIn } = useAuth();

	if (isSignedIn) {
		return <Redirect href={'/'} />;
	}
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
