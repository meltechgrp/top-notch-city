import AppCrashScreen from '@/components/shared/AppCrashScreen';
import headerLeft from '@/components/shared/headerLeft';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export const unstable_settings = {
	initialRouteName: 'index',
};

export default function SecurityLayout() {
	const theme = useResolvedTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTitleAlign: 'center',
				headerBackVisible: false,
				headerLeft: headerLeft(),
				headerTitleStyle: { color: theme == 'dark' ? 'white' : 'black' },
				headerStyle: {
					backgroundColor:
						theme == 'dark' ? Colors.light.background : Colors.dark.background, // 64 64 64
				},
			}}>
			<Stack.Screen
				name="index"
				options={{
					title: 'Security',
				}}
			/>
			<Stack.Screen
				name="delete-account"
				options={{
					title: 'Delete Account',
				}}
			/>
			<Stack.Screen
				name="change-password"
				options={{
					title: 'Change Password',
				}}
			/>
		</Stack>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
