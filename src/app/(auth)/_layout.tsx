import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ImageBackground } from '@/components/ui';
import { ErrorBoundaryProps, Stack } from 'expo-router';
export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'signin',
};

export default function AuthLayout() {
	return (
		<ImageBackground
			source={require('@/assets/images/landing/auth-banner.png')}
			className="flex-1 bg-cover">
			<Stack
				screenOptions={{
					headerShown: false,
					headerBackVisible: true,
				}}
			/>
		</ImageBackground>
	);
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
