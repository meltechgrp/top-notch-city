import { Icon, Pressable, Text } from '@/components/ui';
import { Edit, Trash } from 'lucide-react-native';
import Reanimated, {
	runOnJS,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import ReanimatedSwipeable, {
	SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { ReactNode, useRef } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
	children: ReactNode;
	rightAction: () => void;
	leftAction: () => void;
};

export default function SwipeableWrapper({
	children,
	rightAction,
	leftAction,
}: Props) {
	const height = useSharedValue(1);
	const opacity = useSharedValue(1);

	const animatedContainerStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ scaleY: height.value }],
	}));
	const reanimatedRef = useRef<SwipeableMethods>(null);
	const handleSwipeDelete = () => {
		// Animate out
		opacity.value = withTiming(0, { duration: 200 });
		height.value = withTiming(0, { duration: 200 }, () => {
			runOnJS(leftAction)();
		});
	};
	const RightAction = (
		prog: SharedValue<number>,
		drag: SharedValue<number>
	) => {
		const styleAnimation = useAnimatedStyle(() => {
			return {
				transform: [{ translateX: drag.value + 80 }],
			};
		});

		return (
			<Pressable
				onPress={() => {
					if (process.env.EXPO_OS === 'ios') {
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
					}
					console.log('edit');
					reanimatedRef.current?.reset();
					rightAction();
				}}>
				<Reanimated.View
					className="bg-green-500 flex-1 items-center justify-center"
					style={[styleAnimation, styles.rightAction]}>
					<Icon as={Edit} className="text-white" />
					<Text className="text-white">Edit</Text>
				</Reanimated.View>
			</Pressable>
		);
	};
	const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
		const styleAnimation = useAnimatedStyle(() => {
			return {
				transform: [{ translateX: drag.value - 80 }],
			};
		});
		return (
			<Pressable
				onPress={() => {
					if (process.env.EXPO_OS === 'ios') {
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
					}
					console.log('delete');
					reanimatedRef.current?.reset();
					handleSwipeDelete();
				}}>
				<Reanimated.View
					className="bg-primary flex-1 items-center justify-center"
					style={[styleAnimation, styles.rightAction]}>
					<Icon as={Trash} className="text-white" />
					<Text className="text-white mb-2">Delete</Text>
				</Reanimated.View>
			</Pressable>
		);
	};
	return (
		<Reanimated.View style={animatedContainerStyle}>
			<ReanimatedSwipeable
				friction={1}
				ref={reanimatedRef}
				enableTrackpadTwoFingerGesture
				rightThreshold={10}
				dragOffsetFromRightEdge={40}
				dragOffsetFromLeftEdge={40}
				renderLeftActions={LeftAction}
				renderRightActions={RightAction}
				shouldCancelWhenOutside={true}
				// onSwipeableCloseStartDrag={handleSwipeOpen}
				overshootLeft={false}
				overshootRight={false}
				leftThreshold={10}
				enableContextMenu>
				{children}
			</ReanimatedSwipeable>
		</Reanimated.View>
	);
}

const styles = StyleSheet.create({
	rightAction: {
		minWidth: 80,
		width: '100%',
		minHeight: 80,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
