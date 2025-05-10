import { useTheme } from '@/components/layouts/ThemeProvider';
import headerLeft from '@/components/shared/headerLeft';
import { Colors } from '@/constants/Colors';
import { Stack, useRouter } from 'expo-router';

export default function SupportLayout() {
	const { theme } = useTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: true,
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
			}}>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: 'Support Center',
				}}
			/>
			<Stack.Screen
				name="faq"
				options={{
					headerTitle: 'FAQ',
				}}
			/>
			<Stack.Screen
				name="contact"
				options={{
					headerTitle: 'Call Us',
				}}
			/>
		</Stack>
	);
}
