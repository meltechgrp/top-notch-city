import headerLeft from '@/components/shared/headerLeft';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
	const theme = useResolvedTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				gestureEnabled: true,
				animationDuration: 1000,
				animationTypeForReplace: 'push',
				headerTitleAlign: 'center',
				animation: 'slide_from_right',
				headerTransparent: true,
				headerBackVisible: false,
				headerShadowVisible: true,
				headerLeft: headerLeft(),
				headerTitleStyle: {
					color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
				},
				headerStyle: {
					backgroundColor: 'transparent',
				},
				statusBarStyle: theme == 'dark' ? 'light' : 'dark',
			}}>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: 'Settings',
				}}
			/>
			<Stack.Screen
				name="theme"
				options={{
					headerTitle: 'Themes',
					animationDuration: 1500,
					animation: 'fade_from_bottom',
				}}
			/>
			{/* <Stack.Screen
        name="contact"
        options={{
          headerTitle: 'Call Us',
        }}
      /> */}
		</Stack>
	);
}
