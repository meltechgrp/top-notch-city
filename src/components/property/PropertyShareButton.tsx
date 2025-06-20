import { Share2 } from 'lucide-react-native';
import { Icon, Pressable } from '../ui';
import { Share } from 'react-native';

interface Props {
	property: Property;
}

export function PropertyShareButton({ property }: Props) {
	async function onInvite() {
		try {
			const result = await Share.share({
				message: `Share ${property.title} property to friends or family.`,
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
		<Pressable
			both
			onPress={async () => {
				await onInvite();
			}}
			style={{ padding: 8 }}>
			<Icon as={Share2} className=" text-white w-7 h-7" />
		</Pressable>
	);
}
