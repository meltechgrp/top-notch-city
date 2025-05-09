import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';
import { Icon, Text } from '../ui';
import { Heart, NotepadText, ShoppingBag } from 'lucide-react-native';

type IProps = {
	profile: any;
	activeIndex: number;
	onTabChange: (index: number) => void;
};
export default function ProfileTabHeaderSection(props: IProps) {
	const { profile, onTabChange, activeIndex } = props;
	if (profile?.isBlocked) return null;
	return (
		<View className=" bg-background-info">
			<View className="flex-row border-b border-outline h-12">
				{profileTabs.map(({ label, icon: IconItem }, index) => (
					<Pressable
						key={label}
						onPress={() => {
							onTabChange(index);
						}}
						className={cn(
							'h-full flex-row gap-1 items-center w-1/3 justify-center border-b-2 mt-0.5',
							activeIndex === index ? `border-primary` : `border-transparent`
						)}>
						<Icon
							as={IconItem}
							className={cn(
								activeIndex === index ? `text-primary` : `text-typography/70 `
							)}
						/>
						<Text
							className={cn(
								'text-typography/70 text-sm',
								activeIndex === index && 'text-primary'
							)}>
							{label}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export const profileTabs = [
	{
		label: 'Listings',
		icon: ShoppingBag,
		key: 'listings',
	},
	{
		label: 'Wishlist',
		icon: Heart,
		key: 'wishlist',
	},
	{
		label: 'Bookings',
		icon: NotepadText,
		key: 'bookings',
	},
];
