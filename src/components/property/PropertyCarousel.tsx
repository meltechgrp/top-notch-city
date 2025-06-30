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
import Layout from '@/constants/Layout';
import eventBus from '@/lib/eventBus';

type Props = {
	media: Media[];
	width: number;
	factor?: number;
	pointerPosition?: number;
	withBackdrop?: boolean;
	loop?: boolean;
	autoPlay?: boolean;
	paginationLenght?: number;
	scrollAnimationDuration?: number;
	stackMode?: boolean;
	isOwner?: boolean;
	withPagination?: boolean;
	canPlayVideo?: boolean;
	setSelectedIndex?: (val: number) => void;
	selectedIndex?: number;
	paginationsize?: number;
};

function PropertyCarousel({
	media,
	width,
	factor,
	pointerPosition = 10,
	paginationsize = 8,
	withBackdrop,
	loop = false,
	scrollAnimationDuration = 800,
	autoPlay = false,
	stackMode = false,
	withPagination = true,
	canPlayVideo,
	paginationLenght,
	setSelectedIndex,
	selectedIndex,
	isOwner,
}: Props) {
	const { bannerHeight } = Layout;
	const [enabledCarousel, setEnabledCarousel] = React.useState(false)
	const theme = useResolvedTheme();
	const progress = useSharedValue<number>(0);
	const baseOptions = {
		vertical: false,
		width: width,
		height: factor ? width * factor : bannerHeight,
	} as const;
	const ref = React.useRef<ICarouselInstance>(null);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};
	React.useEffect(() => {
			eventBus.addEventListener('LIST-SCROLL', (state: boolean)=> {
				setEnabledCarousel(state)
			});
	
			return () => {
				eventBus.removeEventListener(
					'LIST-SCROLL',
					(state: boolean)=> {
				setEnabledCarousel(true)
			}
				);
			};
		}, []);
	return (
		<View className="relative rounded-xl overflow-hidden">
			<Carousel
				ref={ref}
				{...baseOptions}
				loop={loop}
				enabled={enabledCarousel}
				autoPlay={autoPlay}
				autoPlayInterval={2000}
				scrollAnimationDuration={scrollAnimationDuration}
				defaultIndex={selectedIndex}
				onProgressChange={progress}
				onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
					'worklet';
					g.enabled(false);
				}}
				onSnapToItem={setSelectedIndex}
				style={{ width: width }}
				data={media}
				renderItem={(props) => (
					<PropertyMedia
						withBackdrop={withBackdrop}
						source={props.item}
						isOwner={isOwner}
						isVisible
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
				<Pagination.Basic<Media>
					progress={progress}
					data={media?.slice(0, paginationLenght)}
					size={paginationsize}
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
