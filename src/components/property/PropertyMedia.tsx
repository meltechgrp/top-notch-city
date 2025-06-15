import { generateMediaUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { ImageStyle, StyleProp, ViewProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Icon, Pressable, View } from '../ui';
import { CirclePlay, Pause } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { useIsFocused } from '@react-navigation/native';

interface Props extends AnimatedProps<ViewProps> {
	style?: StyleProp<ImageStyle>;
	index?: number;
	rounded?: boolean;
	source: string;
	withBackdrop?: boolean;
	canPlayVideo?: boolean;
	isVisible?: boolean;
	nativeControls?: boolean;
	onPress?: (val: string) => void;
}

export const PropertyMedia: React.FC<Props> = (props) => {
	const {
		style,
		index = 0,
		rounded = false,
		withBackdrop = false,
		canPlayVideo = true,
		testID,
		nativeControls = false,
		className,
		isVisible = true,
		onPress,
		...animatedViewProps
	} = props;
	const isFocused = useIsFocused();
	const uri = useMemo(() => generateMediaUrl(props.source), [props.source]);
	const isImage = uri.endsWith('.jpg');
	const isVideo = uri.endsWith('.mp4');
	// Setup player if media is video
	const player = useVideoPlayer(
		isVideo && isFocused && uri ? uri : null,
		(player) => {
			try {
				player.loop = false;
				player.muted = true;
			} catch (e) {
				console.warn('VideoPlayer setup failed', e);
			}
		}
	);

	const { isPlaying } = useEvent(player, 'playingChange', {
		isPlaying: player?.playing,
	});

	return (
		<Animated.View
			testID={testID}
			className={cn('relative flex-1', className)}
			{...animatedViewProps}>
			{isVisible && isImage ? (
				<Pressable className="flex-1" onPress={() => onPress?.(uri)}>
					<Animated.Image
						style={[style]}
						className={cn('w-full h-full', rounded && 'rounded-xl')}
						source={{ uri }}
						resizeMode="cover"
					/>
				</Pressable>
			) : null}
			{isVisible && isVideo && player ? (
				<Pressable
					className={cn(
						'relative w-full h-full',
						rounded && 'rounded-xl overflow-hidden'
					)}>
					<VideoView
						style={[style, { backgroundColor: 'transparent' }]}
						player={player}
						contentFit="cover"
						// surfaceType="textureView"
						nativeControls={false}
						className={cn('w-full h-full', rounded && 'rounded-xl')}
					/>
					{/* ▶️ Play icon overlay */}
					<Pressable
						onPress={() => {
							if (!canPlayVideo) return onPress?.(uri);
							if (isPlaying) {
								player.pause();
							} else {
								player.play();
							}
						}}
						className="absolute z-10 inset-0 items-center justify-center">
						{canPlayVideo && (
							<View className="p-2 rounded-full bg-black/30 ">
								{isPlaying ? (
									<Icon as={Pause} className=" text-primary w-10 h-10" />
								) : (
									<Icon as={CirclePlay} className=" text-primary w-10 h-10" />
								)}
							</View>
						)}
					</Pressable>
				</Pressable>
			) : null}

			{withBackdrop && (
				<View className="absolute w-full h-full bg-black/30 ios:z-10" />
			)}
		</Animated.View>
	);
};
