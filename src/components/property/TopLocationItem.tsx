import { cn } from '@/lib/utils';
import { TouchableHighlight, useWindowDimensions, View } from 'react-native';
import { Card, Image, Text } from '../ui';
import { MapPin } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { Locations } from '@/app/(protected)/property/locations';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';

type Props = {
	data: Locations[0];
	className?: string;
};
export default function TopLocationItem(props: Props) {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const { data, className } = props;
	const { banner, name, properties, id } = data;
	const newWidth = useMemo(() => width / 2 - 24, [width]);
	return (
		<TouchableHighlight
			style={{ width: newWidth }}
			className={cn('relative overflow-hidden rounded-xl ', className)}
			onPress={() => {
				hapticFeed();
				router.push({
					pathname: `/property/locations/[locationId]`,
					params: {
						locationId: id,
					},
				});
			}}>
			<Card className=" bg-background-muted flex-1 p-2 pb-4 relative overflow-hidden rounded-xl">
				<View className="flex-1">
					<Image
						source={banner}
						alt="banner"
						className="w-full h-[11rem] rounded-xl object-cover"
					/>
				</View>
				<View className="pt-3 gap-2 w-full">
					<View className="flex-row items-center gap-1">
						<MapPin size={14} color={'#F8AA00'} />
						<Text
							numberOfLines={1}
							className=" text-sm font-medium font-heading">
							{name}
						</Text>
					</View>
					<Text size="xs" className="px-4">
						({properties}) Properties
					</Text>
				</View>
			</Card>
		</TouchableHighlight>
	);
}
