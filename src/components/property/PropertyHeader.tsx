import { Icon, Pressable, View } from '@/components/ui';
import { ChevronLeftIcon, Heart, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { hapticFeed } from '../HapticTab';

export default function PropertyHeader({ id, title }: Property) {
	const router = useRouter();
	return (
		<View className="bg-transparent absolute top-0 z-30 w-full">
			<SafeAreaView edges={['top']} className=" bg-transparent">
				<View className="flex-row justify-between">
					<Pressable
						onPress={() => router.back()}
						className="py-2 flex-row items-center pl-2 android:pr-4">
						<Icon className=" w-8 h-8" as={ChevronLeftIcon} />
					</Pressable>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}
						className="mr-2 gap-4">
						<Pressable
							onPress={() => {
								hapticFeed();
								router.push({
									pathname: '/property/[propertyId]/share',
									params: { propertyId: id, name: title },
								});
							}}
							style={{ padding: 8 }}>
							<Icon as={Share2} className=" text-white w-7 h-7" />
						</Pressable>
						<Pressable onPress={() => {}} style={{ padding: 8 }}>
							<Icon as={Heart} className=" text-white w-7 h-7" />
						</Pressable>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}
