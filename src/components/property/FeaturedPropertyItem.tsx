import { cn } from '@/lib/utils';
import { formatMoney, toNaira } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import { router } from 'expo-router';
import { useMemo } from 'react';
import capitalize from 'lodash-es/capitalize';
import { TouchableHighlight, View } from 'react-native';
import { Property } from './PropertyHorizontalList';
import { ImageBackground, Text } from '../ui';
import { Map, MapPin } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { useStore } from '@/store';

type Props = {
	data: Property;
	className?: string;
	isMine?: boolean;
	disableDisplay?: boolean;
};
export default function FeaturedPropertyItem(props: Props) {
	const { data, className, isMine, disableDisplay } = props;
	const { displayStyle } = useStore();
	const { banner, name, price, location, id } = data;

	const { width, onLayout } = useLayout();
	// prettier-ignore
	const height = useMemo(() => Math.round((width - 16)), [width])
	return (
		<TouchableHighlight
			onLayout={onLayout}
			className={cn(
				'relative flex-1 overflow-hidden rounded-xl ',
				className,
				!disableDisplay && displayStyle == 'flex' ? 'h-44' : 'h-32'
			)}
			style={{ height }}
			onPress={() => {
				hapticFeed();
				// if (isMine) {
				// 	router.push({
				// 		pathname: `/(protected)/(tabs)/home`,
				// 		params: {
				// 			propertyId: '',
				// 		},
				// 	});
				// } else {
				// router.push({
				// 	pathname: `/property/[propertyId]`,
				// 	params: {
				// 		propertyId: id,
				// 	},
				// });
				// }
			}}>
			<ImageBackground
				source={banner}
				alt="banner"
				className=" flex-1 relative overflow-hidden rounded-xl">
				<View className="flex-1 bg-black/10 p-4">
					<View className="flex-1 items-end">
						<View className=" flex-row items-center justify-center gap-1 py-1 px-2.5 rounded-full bg-primary-600 ">
							<Map size={12} color={'#fff'} />
							<Text className="text-xl text-white">{2.3}</Text>
							<Text className=" text-white">km</Text>
						</View>
					</View>
					<View className="pt-3 w-full">
						<Text size="2xl" className=" text-white" numberOfLines={1}>
							{capitalize(name)}
						</Text>
						<View className="flex-row justify-between pt-2 items-center">
							<View className="flex-row justify-center items-center gap-1">
								<MapPin size={18} color={'red'} />
								<Text className="text-white text-base">{location}</Text>
							</View>

							<Text className="text-white text-base mt-1">
								{formatMoney(price, 'NGN', 0)}
							</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
		</TouchableHighlight>
	);
}
