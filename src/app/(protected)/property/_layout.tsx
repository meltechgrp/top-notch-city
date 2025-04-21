import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, Stack, useRouter } from 'expo-router';

export default function PropertyLayout() {
	const router = useRouter();
	return (
		<Stack
			screenOptions={{
				headerShown: true,
			}}
		/>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
