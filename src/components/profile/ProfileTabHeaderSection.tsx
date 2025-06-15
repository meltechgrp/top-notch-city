import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';
import { Heading, Icon } from '../ui';
import { BookmarkCheck, ChartNoAxesColumn, House } from 'lucide-react-native';

type IProps = {
	profile: Me;
	activeIndex: number;
	onTabChange: (index: number) => void;
};
export default function ProfileTabHeaderSection(props: IProps) {
	const { profile, onTabChange, activeIndex } = props;
	// if (profile?.isBlocked) return null
	return (
		<View className="px-4 bg-background-muted">
			<View className="flex-row border-b border-outline h-12">
				{profileTabs.map(({ label, icon }, index) => (
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
							as={icon}
							className={cn(activeIndex === index ? `text-primary` : ` `)}
						/>
						<Heading
							className={cn(
								' text-sm',
								activeIndex === index && 'text-primary'
							)}>
							{label}
						</Heading>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export const profileTabs = [
	{
		label: 'Properties',
		icon: House,
		key: 'properties',
	},
	{
		label: 'Wishlist',
		icon: BookmarkCheck,
		key: 'wishlist',
	},
	{
		label: 'Analytics',
		icon: ChartNoAxesColumn,
		key: 'analytic',
	},
];
