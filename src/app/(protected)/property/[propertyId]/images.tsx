import { hapticFeed } from '@/components/HapticTab';
import { PropertyMedia } from '@/components/property/PropertyMedia';
import { PropertyModalMediaViewer } from '@/components/property/PropertyModalMediaViewer';
import { Box, View } from '@/components/ui';
import { usePropertyStore } from '@/store/propertyStore';
import { useLayout } from '@react-native-community/hooks';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';

export default function Images() {
	const { getImages } = usePropertyStore();
	const { width, onLayout } = useLayout();
	const images = getImages();

	const [visible, setVisible] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleOpen = (index: number) => {
		hapticFeed(true);
		setSelectedIndex(index);
		setVisible(true);
	};
	return (
		<>
			<Box onLayout={onLayout} className="flex-1">
				<FlashList
					numColumns={2}
					data={images}
					renderItem={({ item, index }) => (
						<PropertyMedia
							style={{ height: (width - 8) / 2, maxWidth: (width - 30) / 2 }}
							rounded
							className="px-2"
							source={item}
							onPress={() => handleOpen(index)}
						/>
					)}
					ListFooterComponent={() => <View className=" h-16" />}
					ItemSeparatorComponent={() => <View className="h-4" />}
					estimatedItemSize={230}
					keyExtractor={(item) => item}
				/>
			</Box>
			<PropertyModalMediaViewer
				width={width}
				media={images}
				visible={visible}
				setVisible={setVisible}
				selectedIndex={selectedIndex}
			/>
		</>
	);
}
