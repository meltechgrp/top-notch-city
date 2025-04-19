import AppCrashScreen from '@/components/shared/AppCrashScreen';
import { Button, ButtonText } from '@/components/ui';
import { ErrorBoundaryProps, Stack, useRouter } from 'expo-router';

export default function PropertyLayout() {
	const router = useRouter();
	return (
		<Stack
			screenOptions={{
				...(process.env.EXPO_OS !== 'ios'
					? {}
					: {
							headerLargeTitle: true,
							headerTransparent: true,
							headerBlurEffect: 'systemChromeMaterial',
							headerLargeTitleShadowVisible: false,
							headerShadowVisible: true,
							headerLargeStyle: {
								// NEW: Make the large title transparent to match the background.
								backgroundColor: 'transparent',
							},
						}),
			}}>
			<Stack.Screen name="[propertyId]/index" options={{ headerTitle: '' }} />
			<Stack.Screen
				name="[propertyId]/edit"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.5, 0.75, 1],
					sheetGrabberVisible: true,
					headerLargeTitle: false,
					headerTitle: 'Edit list',
				}}
			/>
			{/* <Stack.Screen
				name="[propertyId]/product/new"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.8, 1],
					sheetGrabberVisible: true,
					headerLargeTitle: false,
					headerTitle: 'Add product',
				}}
			/> */}
			<Stack.Screen
				name="[propertyId]/share"
				options={{
					presentation: 'formSheet',
					sheetGrabberVisible: true,
					headerLargeTitle: false,
					headerTitle: 'Share Property',
				}}
			/>
			<Stack.Screen
				name="[propertyId]/delete"
				options={{
					presentation: 'formSheet',
					sheetAllowedDetents: [0.5],
					sheetGrabberVisible: true,
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="[propertyId]/3d-view"
				options={{
					presentation: 'fullScreenModal',
					headerLargeTitle: true,
					headerTitle: '3D View',
					headerLeft: () => (
						<Button variant="outline" onPress={() => router.back()}>
							<ButtonText>Back</ButtonText>
						</Button>
					),
				}}
			/>
		</Stack>
	);
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return <AppCrashScreen />;
}
