import Platforms from '@/constants/Plaforms';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
	return (
		<PlatformPressable
			{...props}
			onPressIn={(ev) => {
				if (process.env.EXPO_OS === 'ios') {
					// Add a soft haptic feedback when pressing down on the tabs.
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				props.onPressIn?.(ev);
			}}
		/>
	);
}

export async function hapticFeed(both?: boolean) {
	if (!both && Platforms.isAndroid()) return;
	await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
