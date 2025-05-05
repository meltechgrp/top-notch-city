import { useTheme } from '@/components/layouts/ThemeProvider';
import { Box, Text, View } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function SellScreen() {
	const { theme } = useTheme();
	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: 'Sell Properties',
					headerLargeTitle: false,
					headerTitleStyle: { color: theme == 'dark' ? 'white' : 'black' },
					headerStyle: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					},
				}}
			/>
			<Box className="flex-1 justify-center items-center">
				<Text size="2xl">Sell Content Here</Text>
			</Box>
		</>
	);
}
