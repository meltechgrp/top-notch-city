import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { ErrorBoundaryProps, router, Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedRoutesLayout() {
	const pathname = usePathname();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerBackVisible: true,
				statusBarStyle: 'dark',
			}}
		/>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
