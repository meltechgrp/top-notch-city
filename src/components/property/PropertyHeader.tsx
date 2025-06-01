import { Icon, ImageBackground, Text, View } from '@/components/ui';
import { MapPin } from 'lucide-react-native';
import { composeFullAddress, formatMoney } from '@/lib/utils';
import Layout from '@/constants/Layout';
import { useMemo } from 'react';
import { generateMediaUrl } from '@/lib/api';

export default function PropertyHeader({
	media_urls,
	price,
	address,
	title,
}: Property) {
	const height = Layout.window.height / 2.3;

	const images = useMemo(
		() => media_urls?.filter((item) => item.endsWith('jpg')) ?? [],
		[media_urls]
	);
	return (
		<ImageBackground
			source={{ uri: generateMediaUrl(images[0]) }}
			style={{ height }}
			className="  bg-cover object-cover bg-center overflow-hidden rounded-b-3xl">
			<View className="gap-2 flex-1 p-4 py-8 justify-end bg-black/40">
				<Text size="3xl" className="text-white">
					{title}
				</Text>
				<View className=" bg-primary w-1/2 rounded-2xl p-1 px-4">
					<Text size="2xl" className="text-white">
						{formatMoney(price, 'NGN', 0)}
					</Text>
				</View>
				<View className=" flex-row items-center gap-2">
					<Icon as={MapPin} className="text-primary" />
					<Text size="xl" className=" text-white">
						{composeFullAddress(address)}
					</Text>
				</View>
			</View>
		</ImageBackground>
	);
}
