import * as React from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
	ICarouselInstance,
	Pagination,
} from 'react-native-reanimated-carousel';
import { PropertyMedia } from './PropertyMedia';
import { Colors } from '@/constants/Colors';
import { useResolvedTheme } from '../ui';

type Props = {
	images: string[];
	width: number;
	factor?: number;
	pointerPosition?: number;
	withBackdrop?: boolean;
	loop?: boolean;
	autoPlay?: boolean;
	stackMode?: boolean;
	withPagination?: boolean;
	canPlayVideo?: boolean;
	setSelectedIndex?: (val: number) => void;
	selectedIndex?: number;
	mediaType?: 'image' | 'video';
};

function PropertyCarousel({
	images,
	width,
	factor = 0.6,
	pointerPosition = 10,
	withBackdrop,
	loop = false,
	autoPlay = false,
	stackMode = false,
	withPagination = true,
	canPlayVideo,
	mediaType,
	setSelectedIndex,
	selectedIndex,
}: Props) {
	const theme = useResolvedTheme();
	const progress = useSharedValue<number>(0);
	const baseOptions = {
		vertical: false,
		width: width,
		height: width * factor,
	} as const;
	const ref = React.useRef<ICarouselInstance>(null);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};
	const files = React.useMemo(
		() => images.filter((img) => img.endsWith('.jpg')),
		[images]
	);
	return (
		<View className="relative rounded-xl overflow-hidden">
			<Carousel
				ref={ref}
				{...baseOptions}
				loop={loop}
				autoPlay={autoPlay}
				autoPlayInterval={2000}
				scrollAnimationDuration={800}
				defaultIndex={selectedIndex}
				onProgressChange={progress}
				onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
					'worklet';
					g.enabled(false);
				}}
				onSnapToItem={setSelectedIndex}
				style={{ width: width }}
				data={files}
				renderItem={(props) => (
					<PropertyMedia
						withBackdrop={withBackdrop}
						source={props.item}
						mediaType={mediaType}
						canPlayVideo={canPlayVideo}
						{...props}
					/>
				)}
				pagingEnabled={true}
				mode={stackMode ? 'horizontal-stack' : undefined}
				modeConfig={
					stackMode
						? {
								snapDirection: 'left',
								stackInterval: 18,
							}
						: undefined
				}
				customConfig={
					stackMode ? () => ({ type: 'positive', viewCount: 5 }) : undefined
				}
			/>
			{withPagination && (
				<Pagination.Basic<string>
					progress={progress}
					data={files}
					size={8}
					dotStyle={{
						borderRadius: 100,
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					}}
					activeDotStyle={{
						borderRadius: 100,
						overflow: 'hidden',
						backgroundColor: Colors.primary,
					}}
					containerStyle={[
						{
							position: 'absolute',
							bottom: pointerPosition,
							gap: 5,
						},
					]}
					horizontal
					onPress={onPressPagination}
				/>
			)}
		</View>
	);
}

export default PropertyCarousel;
