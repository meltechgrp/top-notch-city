import AppCrashScreen from '@/components/shared/AppCrashScreen';
import headerLeft from '@/components/shared/headerLeft';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { ErrorBoundaryProps, Stack } from 'expo-router';

export default function PropertysLayout() {
	const theme = useResolvedTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerTitleAlign: 'center',
				headerBackVisible: false,
				headerLeft: headerLeft(),
				statusBarStyle: theme == 'dark' ? 'light' : 'dark',
				headerTitleStyle: { color: theme == 'dark' ? 'white' : 'black' },
				headerStyle: {
					backgroundColor:
						theme == 'dark' ? Colors.light.background : Colors.dark.background, // 64 64 64
				},
			}}>
			<Stack.Screen
				name="[propertyId]/index"
				options={{
					headerTitleStyle: { color: 'white', fontSize: 20 },
					gestureEnabled: true,
					fullScreenGestureEnabled: true,
				}}
			/>
			<Stack.Screen
				name="[propertyId]/share"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.4, 0.75],
					sheetGrabberVisible: true,
					sheetElevation: 100,
				}}
			/>
			<Stack.Screen
				name="[propertyId]/images"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.75, 1],
					sheetGrabberVisible: true,
				}}
			/>
			<Stack.Screen
				name="[propertyId]/videos"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.75, 1],
					sheetGrabberVisible: true,
				}}
			/>
			<Stack.Screen
				name="[propertyId]/booking"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.75, 1],
					sheetGrabberVisible: true,
					sheetElevation: 300,
				}}
			/>
		</Stack>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
