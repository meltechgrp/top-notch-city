import { cn } from '@/lib/utils';
import { formatMoney, toNaira } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Property } from './PropertyHorizontalList';
import { ImageBackground, Text } from '../ui';
import { Map, MapPin } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import FacilityItem from './FacilityItem';

type Props = {
	data: Property;
	className?: string;
	showFacilites?: boolean;
	isMine?: boolean;
};
export default function PropertyListItem(props: Props) {
	const { data, className, showFacilites = false, isMine } = props;
	const { banner, name, price, location, id } = data;

	const { width, onLayout } = useLayout();
	// prettier-ignore
	const height = useMemo(() => Math.round((width - 16) * (3 / 4)), [width])

	const facilites = [
		{
			name: '6 Bedroom',
			icon: 'bedroom',
		},
		{
			name: '4 Bathroom',
			icon: 'bathroom',
		},
		{
			name: 'Garden',
			icon: 'garden',
		},
	];
	return (
		<Pressable
			onLayout={onLayout}
			key={data.id}
			className={cn(
				'relative w-[240px] overflow-hidden min-h-[190px] active:scale-[0.95]',
				className
			)}
			style={{ borderRadius: 8, height }}
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
				router.push({
					pathname: `/property/[propertyId]`,
					params: {
						propertyId: id,
					},
				});
				// }
			}}>
			<ImageBackground
				source={banner}
				alt="banner"
				className=" flex-1 relative overflow-hidden rounded-xl">
				<View className="flex-1 bg-black/10 p-4">
					<View className="flex-1 items-end">
						<View className=" flex-row items-center justify-center gap-1 py-1 px-2.5 rounded-full bg-primary-600/60">
							<Text className="text-white">{formatMoney(price, 'NGN', 0)}</Text>
						</View>
					</View>
					<View className="pt-3 w-full gap-2">
						<Text
							className="text-base text-white font-semibold"
							numberOfLines={1}>
							{name}
						</Text>
						<View className="flex-row items-center gap-1">
							<MapPin size={14} color={'yellow'} />
							<Text className="text-white text-xs">{location}</Text>
						</View>
						{showFacilites && (
							<View className="flex-row justify-between flex-wrap gap-4">
								{facilites.map((item) => (
									<FacilityItem
										textClassname="text-xs text-white"
										{...item}
										key={item.name}
										iconSize={16}
									/>
								))}
							</View>
						)}
					</View>
				</View>
			</ImageBackground>
		</Pressable>
	);
}
