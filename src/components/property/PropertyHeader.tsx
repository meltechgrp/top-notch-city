import { Icon, Pressable, View } from '@/components/ui';
import { ChevronLeftIcon, Heart, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { hapticFeed } from '../HapticTab';
import { Share } from 'react-native';

export default function PropertyHeader({ id, title }: Property) {
	const router = useRouter();

	async function onInvite() {
		try {
			const result = await Share.share({
				message: `Share ${title} property to friends or family.`,
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
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
			}}
			className="mr-2 gap-4">
			<Pressable
				onPress={async () => {
					hapticFeed();
					await onInvite();
				}}
				style={{ padding: 8 }}>
				<Icon as={Share2} className=" text-white w-7 h-7" />
			</Pressable>
			<Pressable onPress={() => {}} style={{ padding: 8 }}>
				<Icon as={Heart} className=" text-white w-7 h-7" />
			</Pressable>
		</View>
	);
}
