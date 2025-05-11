import AppCrashScreen from '@/components/shared/AppCrashScreen';
import headerLeft from '@/components/shared/headerLeft';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { ErrorBoundaryProps, Stack, useRouter } from 'expo-router';

export default function PropertyLayout() {
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
				options={{
					headerTitle: 'Top Locations',
				}}
			/>
		</Stack>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
