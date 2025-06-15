import { Icon, Pressable, View } from '@/components/ui';
import { Bookmark, Heart, Share2 } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { Share } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToWishList, likeProperty } from '@/actions/property';
import { cn } from '@/lib/utils';

export default function PropertyHeader({
	title,
	id,
	interaction,
}: {
	title: string;
	id: string;
	interaction?: Owner_interaction;
}) {
	const client = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: () => likeProperty({ id }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['properties', id] });
		},
	});
	const { mutate: mutate2 } = useMutation({
		mutationFn: () => addToWishList({ id }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['properties', id] });
		},
	});

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
	function hnadleLike() {
		mutate();
	}
	function hnadleWishList() {
		mutate2();
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
					await hapticFeed(true);
					await onInvite();
				}}
				style={{ padding: 8 }}>
				<Icon as={Share2} className=" text-white w-7 h-7" />
			</Pressable>
			<Pressable onPress={hnadleLike} style={{ padding: 8 }}>
				<Icon
					as={Heart}
					className={cn(
						' text-white w-7 h-7',
						interaction?.liked ? 'text-primary' : 'text-white'
					)}
				/>
			</Pressable>
			<Pressable onPress={hnadleWishList} style={{ padding: 8 }}>
				<Icon
					as={Bookmark}
					className={cn(
						' text-white w-7 h-7',
						interaction?.added_to_wishlist ? 'text-primary' : 'text-white'
					)}
				/>
			</Pressable>
		</View>
	);
}
