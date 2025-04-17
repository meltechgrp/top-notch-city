import { Bell, MapPin } from 'lucide-react-native';
import { Text, View } from '../ui';

export default function HomeNavigation() {
	return (
		<View className="flex-row justify-between items-center px-4">
			<View className="flex-row items-center p-2 basis-[60%] gap-2 rounded-xl bg-white">
				<MapPin color={'orange'} />
				<Text numberOfLines={1} className="text-base">
					Port Harcourt, Rivers
				</Text>
			</View>
			<View className=" p-2 bg-black/20 rounded-full">
				<Bell color={'white'} />
			</View>
		</View>
	);
}
