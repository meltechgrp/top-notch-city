import { Icon, Pressable, View } from '@/components/ui';
import { ChevronLeftIcon, Heart, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { hapticFeed } from '../HapticTab';
import { Share } from 'react-native';

type Props = {
	data: Property;
	setDetailsBotttomSheet: (val: boolean) => void;
};

export default function PropertyHeader({
	data,
	setDetailsBotttomSheet,
}: Props) {
	const router = useRouter();

	async function onInvite() {
		try {
			const result = await Share.share({
				message: `Share ${data.title} property to friends or family.`,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error: any) {
			alert(error.message);
		}
	}
	return (
		<View className=" absolute top-4 z-50 left-0 w-full">
			<SafeAreaView edges={['top']} className="bg-transparent">
				<View className="flex-row justify-between items-center flex-1">
					<Pressable
						both={true}
						onPress={() => {
							setDetailsBotttomSheet(false);
							if (router.canGoBack()) router.back();
							else router.push('/home');
						}}
						className="p-1.5 rounded-full bg-background/50 ml-2 flex-row items-center">
						<Icon className=" w-8 h-8" as={ChevronLeftIcon} />
					</Pressable>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}
						className="mr-2 gap-4">
						<Pressable
							onPress={async () => {
								await hapticFeed(true);
								await onInvite();
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
