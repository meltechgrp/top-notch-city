import React, { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable, {
	SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
	runOnJS,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Icon, Text } from '../ui';
import { MessageCircle, Trash } from 'lucide-react-native';
import eventBus from '@/lib/eventBus';

export default function NotificationItemWrapper({
	children,
	onDelete,
	onRead,
	isRead,
}: {
	children: React.ReactNode;
	onDelete: () => void;
	onRead: () => void;
	isRead: boolean;
}) {
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
			runOnJS(onDelete)();
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
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
					}
					handleSwipeDelete();
				}}>
				<Reanimated.View
					className="bg-primary flex-1 items-center justify-center rounded-xl"
					style={[styleAnimation, styles.rightAction]}>
					<Icon as={Trash} className="text-white" />
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
		if (isRead) return undefined;
		return (
			<Pressable
				onPress={() => {
					if (process.env.EXPO_OS === 'ios') {
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
					}
					onRead();
				}}>
				<Reanimated.View
					className="bg-green-500 flex-1 items-center justify-center rounded-xl"
					style={[styleAnimation, styles.rightAction]}>
					<Icon as={MessageCircle} className="text-white" />
					<Text className="text-white">Read</Text>
				</Reanimated.View>
			</Pressable>
		);
	};
	useEffect(() => {
		if (!isRead) return;
		reanimatedRef.current?.close();
	}, [isRead]);

	function handleSwipeOpen() {
		eventBus.dispatchEvent('NOTIFICATION_OPEN', null);
	}

	useEffect(() => {
		eventBus.addEventListener('NOTIFICATION_OPEN', () =>
			reanimatedRef.current?.close()
		);

		return () => {
			eventBus.removeEventListener('NOTIFICATION_OPEN', () =>
				reanimatedRef.current?.close()
			);
		};
	}, []);
	return (
		<Reanimated.View style={animatedContainerStyle}>
			<ReanimatedSwipeable
				friction={2}
				ref={reanimatedRef}
				enableTrackpadTwoFingerGesture
				rightThreshold={40}
				dragOffsetFromRightEdge={100}
				renderLeftActions={LeftAction}
				renderRightActions={RightAction}
				onSwipeableCloseStartDrag={handleSwipeOpen}
				overshootLeft={false}
				leftThreshold={40}
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
