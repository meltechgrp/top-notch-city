import AppCrashScreen from '@/components/shared/AppCrashScreen';
import headerLeft from '@/components/shared/headerLeft';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'index',
};

export default function ProfileScreensLayout() {
	const theme = useResolvedTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				gestureEnabled: true,
				animationDuration: 1000,
				animationTypeForReplace: 'push',
				headerTitleAlign: 'center',
				animation: 'slide_from_bottom',
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
			}}>
			<Stack.Screen
				name="index"
				options={{
					title: 'Profile',
				}}
			/>
			<Stack.Screen
				name="account"
				options={{
					title: 'Account',
				}}
			/>
		</Stack>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
