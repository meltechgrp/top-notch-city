import { Box, Text, View } from '@/components/ui';
import { useLayout } from '@react-native-community/hooks';
import { useTempStore } from '@/store';

export default function ListingSucces() {
	const { onLayout, height } = useLayout();
	const { listing, updateListing } = useTempStore();
	return (
		<>
			<Box onLayout={onLayout} className="flex-1 px-4">
				<View className=" py-6 gap-8">
					<Text>last screen</Text>
				</View>
			</Box>
		</>
	);
}
