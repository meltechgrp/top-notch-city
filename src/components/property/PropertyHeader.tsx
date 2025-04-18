import { Heading, ImageBackground, Text, View } from '@/components/ui';
import { MapPin } from 'lucide-react-native';
import { Property } from '../home/FoundProperties';
import { formatMoney } from '@/lib/utils';
import Layout from '@/constants/Layout';

export default function PropertyHeader({
	banner,
	name,
	price,
	location,
}: Property) {
	const height = Layout.window.height / 2.1;
	return (
		<ImageBackground
			source={banner}
			style={{ height }}
			className=" justify-end p-4 py-8 bg-cover object-cover bg-center overflow-hidden rounded-b-sm">
			<View className="gap-2">
				<Heading size="2xl" className="text-white">
					{name}
				</Heading>
				<View className=" flex-row items-center justify-between">
					<View className=" flex-row items-center gap-2">
						<MapPin size={18} color={'orange'} />
						<Text size="xl" className=" text-white">
							{location}
						</Text>
					</View>
					<Text size="xl" className="text-white">
						{formatMoney(price, 'NGN', 0)}
					</Text>
				</View>
			</View>
		</ImageBackground>
	);
}
