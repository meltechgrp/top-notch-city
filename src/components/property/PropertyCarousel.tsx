import * as React from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
	ICarouselInstance,
	Pagination,
} from 'react-native-reanimated-carousel';
import { PropertyImage } from './PropertyImage';
import { Colors } from '@/constants/Colors';
import { useResolvedTheme } from '../ui';

type Props = {
	images: string[];
	width: number;
};

function PropertyCarousel({ images, width }: Props) {
	const theme = useResolvedTheme();
	const progress = useSharedValue<number>(0);
	const baseOptions = {
		vertical: false,
		width: width,
		height: width * 0.6,
	} as const;

	const ref = React.useRef<ICarouselInstance>(null);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};
	const files = React.useMemo(
		() => images.filter((img) => img.endsWith('jpg')),
		[images]
	);
	return (
		<View className="relative rounded-xl overflow-hidden">
			<Carousel
				ref={ref}
				{...baseOptions}
				loop
				scrollAnimationDuration={500}
				onProgressChange={progress}
				style={{ width: width }}
				data={files}
				renderItem={(props) => <PropertyImage source={props.item} {...props} />}
			/>
			<Pagination.Basic<string>
				progress={progress}
				data={files}
				size={7}
				dotStyle={{
					borderRadius: 100,
					backgroundColor:
						theme == 'dark' ? Colors.light.background : Colors.dark.background,
				}}
				activeDotStyle={{
					borderRadius: 100,
					overflow: 'hidden',
					backgroundColor: Colors.primary,
				}}
				containerStyle={[
					{
						position: 'absolute',
						bottom: 10,
						gap: 5,
					},
				]}
				horizontal
				onPress={onPressPagination}
			/>
		</View>
	);
}

export default PropertyCarousel;
