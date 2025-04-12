import { cn } from '@/lib/utils';
import { formatMoney, toNaira } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import { router } from 'expo-router';
import { useMemo } from 'react';
import capitalize from 'lodash-es/capitalize';
import { Pressable, View } from 'react-native';
import { Property } from './PropertyHorizontalList';
import { ImageBackground, Text } from '../ui';
import { Map, MapPin } from 'lucide-react-native';

type Props = {
	data: Property;
	className?: string;
	isMine?: boolean;
};
export default function PropertyListItem(props: Props) {
	const { data, className, isMine } = props;
	const { banner, name, price, location } = data;

	const { width, onLayout } = useLayout();
	// prettier-ignore
	const height = useMemo(() => Math.round((width - 16) * (3 / 4)), [width])
	return (
		<Pressable
			onLayout={onLayout}
			key={data.id}
			className={cn(
				'relative rounded-[8px] h-[220px] active:scale-[0.95]',
				className
			)}
			style={{ borderRadius: 8, height }}
			onPress={() => {
				if (isMine) {
					router.push({
						pathname: `/(protected)/(tabs)/home`,
						params: {
							propertyId: '',
						},
					});
				} else {
					router.push({
						pathname: `/(protected)/(tabs)/home`,
						params: {
							propertyId: '',
						},
					});
				}
			}}>
			<ImageBackground
				source={banner}
				alt="banner"
				className="rounded-md overflow-hidden flex-1 relative">
				<View className="flex-1 items-end">
					<View className=" flex-row items-center justify-center gap-1 py-1 px-2.5 rounded-full bg-primary-600 ">
						<Map size={12} color={'#fff'} />
						<Text className="text-xl text-white">{2.3}</Text>
						<Text className=" text-white">km</Text>
					</View>
				</View>
				<View className="pt-3 w-full">
					<Text className="text-sm text-black-900" numberOfLines={1}>
						{capitalize(name)}
					</Text>
					<View className="flex-row justify-between border-t border-gray-200 mt-2 pt-2 items-center">
						<View className="flex-row justify-center items-center gap-1">
							<MapPin size={12} color={'red'} />
							<Text className="text-gray-600 text-xs">{location}</Text>
						</View>

						<Text className="text-primary-900 mt-1">
							{formatMoney(price, 'NGN', 0)}
						</Text>
					</View>
				</View>
			</ImageBackground>
		</Pressable>
	);
}
