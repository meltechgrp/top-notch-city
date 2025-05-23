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
import TabView from '../shared/TabView';
import { X } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import Layout from '@/constants/Layout';

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
		opacity.value = withTiming(0);
		setTimeout(() => setVisible(false), 500);
	};
	const animatedImageStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const animatedBackdrop = useAnimatedStyle(() => ({
		backgroundColor: `rgba(0,0,0,${backdropOpacity.value})`,
	}));
	const { width } = Layout.window;
	console.log(width);
	return (
		<>
			<View className="gap-4 flex-1 flex-row flex-wrap justify-between px-4 mx-auto">
				{images.map((image, i) => (
					<Pressable
						key={image.path + i}
						style={{ width: width / 3 - 20 }}
						onPress={() => {
							hapticFeed();
							handleOpen(i);
						}}>
						<Animated.View
							entering={FadeIn}
							exiting={FadeOut}
							className="w-full h-32">
							<Image
								source={image.path}
								alt="Property Image"
								className="w-full h-full rounded-md"
							/>
						</Animated.View>
					</Pressable>
				))}
			</View>

			<Modal
				visible={visible}
				onRequestClose={closeModal}
				animationType="fade"
				transparent>
				<Animated.View className="flex-1 relative" style={animatedBackdrop}>
					<View className="flex-1" collapsable={false}>
						<TabView
							activeTab={selectedIndex}
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
										<TouchableWithoutFeedback
											onPress={closeImage}
											className="w-full h-full">
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
