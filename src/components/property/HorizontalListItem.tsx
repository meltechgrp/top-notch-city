import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import capitalize from 'lodash-es/capitalize';
import { Card, Heading, Icon, Image, Pressable, Text, View } from '../ui';
import { Bath, Bed } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { generateMediaUrl } from '@/lib/api';

type Props = {
	data: Property;
	className?: string;
};
export default function HorizontalListItem(props: Props) {
	const { data, className } = props;
	const { media, price, id, title, amenities } = data;
	const router = useRouter();
	const Find = (item: string) =>
		amenities?.find((a) => a.name == item)?.value || 0;
	return (
		<Pressable
			both
			onPress={() => {
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
				<Image
					source={{ uri: generateMediaUrl(media[0]).uri }}
					className="h-full w-32 rounded-xl"
					alt={title}
				/>
				<View className=" w-[120px]">
					<Heading size="md" className=" font-medium" numberOfLines={1}>
						{capitalize(title)}
					</Heading>
					<View className=" gap-1">
						<View className="flex-row items-center gap-1">
							<Text className="text-sm font-medium text-gray-400">Type:</Text>
							<Text className="text-sm font-medium text-gray-400">Duplex</Text>
						</View>
						<View className="flex-row gap-3">
							<View className="flex-row items-center gap-1">
								<Icon as={Bed} size={'sm'} className="text-primary" />
								<Text className="text-sm">{Find('Bedroom')}</Text>
							</View>
							<View className="flex-row items-center gap-1">
								<Icon as={Bath} size={'sm'} className="text-primary" />
								<Text className=" text-sm">{Find('Bathroom')}</Text>
							</View>
						</View>
						<Text size="md" className="text-medium text-typography">
							{formatMoney(price, 'NGN', 0)}
						</Text>
					</View>
				</View>
			</Card>
		</Pressable>
	);
}
