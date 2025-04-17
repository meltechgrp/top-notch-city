import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import { router } from 'expo-router';
import capitalize from 'lodash-es/capitalize';
import { Pressable, View } from 'react-native';
import { Property } from './PropertyHorizontalList';
import { Image, Text } from '../ui';
import { Bath, Bed } from 'lucide-react-native';

type Props = {
	data: Property;
	className?: string;
	isMine?: boolean;
};
export default function HorizontalListItem(props: Props) {
	const { data, className, isMine } = props;
	const { banner, name, price, location } = data;

	return (
		<Pressable
			key={data.id}
			className={cn(
				'relative flex-row h-40 bg-white rounded-xl p-4 gap-4 overflow-hidden active:scale-[0.95]',
				className
			)}
			style={{ borderRadius: 8 }}
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
			<Image source={banner} className="h-full w-40 rounded-xl" alt={name} />
			<View className="pt-3 w-[160px]">
				<Text className="text-base text-black font-semibold" numberOfLines={1}>
					{capitalize(name)}
				</Text>
				<View className=" pt-2 gap-2">
					<View className="flex-row items-center gap-1">
						<Text className="text-sm font-medium text-gray-500">
							Building Type:
						</Text>
						<Text className="text-sm font-medium text-gray-500">Duplex</Text>
					</View>
					<View className="flex-row gap-2">
						<View className="flex-row items-center gap-1">
							<Bed size={12} color={'orange'} />
							<Text className="text-xs">6 Bedroom</Text>
						</View>
						<View className="flex-row items-center gap-1">
							<Bath size={12} color={'orange'} />
							<Text className=" text-xs">4 Bathroom</Text>
						</View>
					</View>

					<Text className="text-blue-500 mt-1">
						{formatMoney(price, 'NGN', 0)}
					</Text>
				</View>
			</View>
		</Pressable>
	);
}
