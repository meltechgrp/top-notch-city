import { useState } from 'react';
import { View, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	FadeOut,
	FadeIn,
	withTiming,
} from 'react-native-reanimated';
import { Image } from '@/components/ui';
import { Grid, GridItem } from '../ui/grid';
import TabView from '../shared/TabView';
import { X } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';

type Props = {
	images: { path: any }[];
};

export default function PropertyImages({ images }: Props) {
	const [visible, setVisible] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const opacity = useSharedValue(0);
	const translateY = useSharedValue(0);
	const backdropOpacity = useSharedValue(1);

	const handleOpen = (index: number) => {
		setSelectedIndex(index);
		setVisible(true);
	};

	const closeModal = () => {
		setVisible(false);
		translateY.value = 0;
		backdropOpacity.value = 1;
	};

	const closeImage = () => {
		hapticFeed();
		opacity.value = withTiming(0);
		setTimeout(() => setVisible(false), 500);
	};
	const animatedImageStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const animatedBackdrop = useAnimatedStyle(() => ({
		backgroundColor: `rgba(0,0,0,${backdropOpacity.value})`,
	}));
	return (
		<>
			<Grid className="gap-4 flex-1" _extra={{ className: 'grid-cols-3' }}>
				{images.map((image, i) => (
					<GridItem
						className="w-full aspect-square"
						key={i + 'a'}
						_extra={{ className: 'col-span-1' }}>
						<Pressable
							onPress={() => {
								hapticFeed();
								handleOpen(i);
							}}>
							<Animated.View
								entering={FadeIn}
								exiting={FadeOut}
								className="w-full h-full">
								<Image
									source={image.path}
									alt="Property Image"
									className="w-full h-full rounded-md"
								/>
							</Animated.View>
						</Pressable>
					</GridItem>
				))}
			</Grid>

			<Modal
				visible={visible}
				onRequestClose={closeModal}
				animationType="fade"
				transparent>
				<Animated.View className="flex-1 relative" style={animatedBackdrop}>
					<View className="flex-1" collapsable={false}>
						<TabView
							activeTab={selectedIndex}
							mode="parallax"
							scrollAnimationDuration={500}
							onTabSelected={setSelectedIndex}>
							{images.map((item, i) => (
								<View
									key={i}
									className="w-full h-full items-center justify-center">
									<Animated.View
										style={[
											{ width: '100%', height: '100%' },
											animatedImageStyle,
										]}>
										<TouchableWithoutFeedback className="w-full h-full">
											<View className="h-full items-center justify-center">
												<Image
													source={item.path}
													alt="Zoomed Property Image"
													className="w-full h-[50%] object-cover"
												/>
											</View>
										</TouchableWithoutFeedback>
									</Animated.View>
								</View>
							))}
						</TabView>
					</View>
					<Pressable
						onPress={closeImage}
						style={{
							position: 'absolute',
							top: 70,
							right: 20,
							zIndex: 10,
						}}>
						<X size={28} color="#fff" />
					</Pressable>
				</Animated.View>
			</Modal>
		</>
	);
}
