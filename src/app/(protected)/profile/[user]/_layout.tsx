import { useTheme } from '@/components/layouts/ThemeProvider';
import AppCrashScreen from '@/components/shared/AppCrashScreen';
import headerLeft from '@/components/shared/headerLeft';
import { Colors } from '@/constants/Colors';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'profile',
};

export default function ProfileScreensLayout() {
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
				headerBackVisible: false,
				headerShadowVisible: true,
				headerLeft: headerLeft(),
				headerTitleStyle: {
					color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
				},
				headerStyle: {
					backgroundColor:
						theme == 'dark' ? Colors.light.background : Colors.dark.background,
				},
				statusBarStyle: theme == 'dark' ? 'light' : 'dark',
			}}
		/>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
