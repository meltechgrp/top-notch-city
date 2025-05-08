import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import capitalize from 'lodash-es/capitalize';
import { Pressable, View } from 'react-native';
import { Property } from './PropertyHorizontalList';
import { Card, Heading, Image, Text } from '../ui';
import { Bath, Bed } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { useRouter } from 'expo-router';

type Props = {
	data: Property;
	className?: string;
	isMine?: boolean;
};
export default function HorizontalListItem(props: Props) {
	const { data, className, isMine } = props;
	const { banner, name, price, id } = data;
	const router = useRouter();

	return (
		<Pressable
			onPress={() => {
				hapticFeed();
				router.push({
					pathname: `/property/[propertyId]`,
					params: {
						propertyId: id,
					},
				});
			}}>
			<Card
				className={cn(
					'relative flex-row h-[110px] rounded-xl p-2 gap-4 overflow-hidden active:scale-[0.95]',
					className
				)}
				style={{ borderRadius: 8 }}>
				<Image source={banner} className="h-full w-32 rounded-xl" alt={name} />
				<View className=" w-[120px]">
					<Heading size="md" className=" font-medium" numberOfLines={1}>
						{capitalize(name)}
					</Heading>
					<View className=" gap-1">
						<View className="flex-row items-center gap-1">
							<Text className="text-sm font-medium text-gray-400">Type:</Text>
							<Text className="text-sm font-medium text-gray-400">Duplex</Text>
						</View>
						<View className="flex-row gap-2">
							<View className="flex-row items-center gap-1">
								<Bed size={14} color={'orange'} />
								<Text className="text-sm">6</Text>
							</View>
							<View className="flex-row items-center gap-1">
								<Bath size={14} color={'orange'} />
								<Text className=" text-sm">4</Text>
							</View>
						</View>
						<Text size="lg" className="text-medium">
							{formatMoney(price, 'NGN', 0)}
						</Text>
					</View>
				</View>
			</Card>
		</Pressable>
	);
}
