import { Modal, TouchableWithoutFeedback } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';

import React from 'react';
import { Pressable, View } from '../../ui';
import PropertyCarousel from '../../property/PropertyCarousel';
import { hapticFeed } from '../../HapticTab';
import { X } from 'lucide-react-native';

type Props = {
	visible: boolean;
	setVisible: (val: boolean) => void;
	selectedIndex: number;
	width: number;
	media: Media[];
	isOwner?: boolean;
	canPlayVideo?: boolean;
};

export function PropertyModalMediaViewer({
	visible,
	setVisible,
	selectedIndex,
	width,
	media,
	isOwner = false,
	canPlayVideo,
}: Props) {
	const opacity = useSharedValue(1);
	const translateY = useSharedValue(0);
	const backdropOpacity = useSharedValue(1);

	const closeModal = () => {
		hapticFeed(true);
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
		backgroundColor: `rgba(0,0,0,0.8)`,
	}));
	return (
		<Modal
			visible={visible}
			onRequestClose={closeModal}
			animationType="fade"
			transparent>
			<Animated.View className="flex-1 relative" style={animatedBackdrop}>
				<View className="flex-1 items-center justify-center">
					<Animated.View
						style={[{ width: '100%', height: '100%' }, animatedImageStyle]}>
						<TouchableWithoutFeedback onPress={closeImage}>
							<View className="h-full w-full relative items-center justify-center">
								<PropertyCarousel
									width={width || 400}
									factor={1}
									media={media}
									withPagination={false}
									stackMode
									isOwner={isOwner}
									canPlayVideo={canPlayVideo}
									selectedIndex={selectedIndex}
								/>
							</View>
						</TouchableWithoutFeedback>
					</Animated.View>
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
	);
}
