import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import { router } from 'expo-router';
import capitalize from 'lodash-es/capitalize';
import { Pressable, View } from 'react-native';
import { Card, Heading, Image, Text } from '../ui';
import { Bath, Bed } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { Property } from '../home/FoundProperties';

type Props = {
	data: Property;
	className?: string;
	isMine?: boolean;
};
export default function SavedListItem(props: Props) {
	const { data, className, isMine } = props;
	const { banner, name, price, location, id } = data;
	return (
		<Pressable
			key={data.id}
			className={cn('relative active:scale-[0.95]', className)}
			onPress={() => {
				hapticFeed();
				router.push({
					pathname: `/property/[propertyId]`,
					params: {
						propertyId: id,
					},
				});
			}}>
			<Card className="flex-1 bg-background-muted gap-4 flex-row">
				<View className=" w-32 h-28 ">
					<Image
						source={banner}
						alt="image"
						className="w-full h-full object-cover rounded-xl"
					/>
				</View>
				<View className="flex-1 gap-1">
					<Heading size="xl" numberOfLines={1}>
						{capitalize(name)}
					</Heading>
					<Text className=" text-blue-500">{formatMoney(price, 'NGN', 0)}</Text>
					<View className="flex-row justify-between pt-2 items-center">
						<View className="flex-row gap-2 items-center">
							<Bed size={14} color={'#F8AA00'} />
							<Text className=" text-sm">5 Bedroom</Text>
						</View>
						<View className="flex-row gap-2 items-center">
							<Bath size={14} color={'#F8AA00'} />
							<Text className=" text-sm">5 Bathroom</Text>
						</View>
					</View>
				</View>
			</Card>
		</Pressable>
	);
}
