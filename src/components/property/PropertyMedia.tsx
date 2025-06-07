import { generateMediaUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { ImageStyle, StyleProp, ViewProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Icon, Pressable, View } from '../ui';
import { CirclePlay, Pause, Play } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

interface Props extends AnimatedProps<ViewProps> {
	style?: StyleProp<ImageStyle>;
	index?: number;
	rounded?: boolean;
	mediaType?: 'image' | 'video';
	source: string;
	withBackdrop?: boolean;
	canPlayVideo?: boolean;
	nativeControls?: boolean;
	onPress?: (val: string) => void;
}

export const PropertyMedia: React.FC<Props> = (props) => {
	const {
		style,
		index = 0,
		rounded = false,
		withBackdrop = false,
		canPlayVideo = false,
		testID,
		nativeControls = false,
		mediaType = 'image',
		className,
		onPress,
		...animatedViewProps
	} = props;

	const uri = useMemo(() => generateMediaUrl(props.source), [props.source]);

	// Setup player if media is video
	const player = useVideoPlayer(mediaType == 'video' ? uri : null, (player) => {
		player.loop = false;
		player.muted = true;
	});

	const { isPlaying } = useEvent(player, 'playingChange', {
		isPlaying: player?.playing,
	});

	return (
		<Animated.View
			testID={testID}
			className={cn('relative flex-1', className)}
			{...animatedViewProps}>
			{mediaType === 'image' ? (
				<Pressable className="flex-1" onPress={() => onPress?.(uri)}>
					<Animated.Image
						style={[style]}
						className={cn('w-full h-full', rounded && 'rounded-xl')}
						source={{ uri }}
						resizeMode="cover"
					/>
				</Pressable>
			) : (
				<Pressable
					className={cn(
						'relative w-full h-full',
						rounded && 'rounded-xl overflow-hidden'
					)}>
					<VideoView
						style={[style, { backgroundColor: 'transparent' }]}
						player={player}
						contentFit="cover"
						allowsFullscreen
						// surfaceType="textureView"
						nativeControls={false}
						className={cn('w-full h-full', rounded && 'rounded-xl')}
					/>
					{/* ▶️ Play icon overlay */}
					{!canPlayVideo && (
						<Pressable
							onPress={() => {
								if (isPlaying) {
									player.pause();
								} else {
									player.play();
								}
							}}
							className="absolute z-10 inset-0 items-center justify-center">
							<View className="p-2 rounded-full bg-black/30 ">
								{isPlaying ? (
									<Icon as={Pause} className=" text-primary w-10 h-10" />
								) : (
									<Icon as={CirclePlay} className=" text-primary w-10 h-10" />
								)}
							</View>
						</Pressable>
					)}
				</Pressable>
			)}

			{withBackdrop && (
				<View className="absolute w-full h-full bg-black/30 ios:z-10" />
			)}
		</Animated.View>
	);
};
