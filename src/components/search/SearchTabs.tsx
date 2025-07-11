import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';
import { Heading, Icon } from '../ui';
import { ListOrdered, Map } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IProps = {
	activeIndex: number;
	onTabChange: (index: number) => void;
};
export default function SearchTabs(props: IProps) {
	const { onTabChange, activeIndex } = props;
	return (
		<View className="w-full flex fixed top-[90%] ios:top-[80%] left-0 z-50">
			<SafeAreaView edges={['bottom']}>
				<View className="flex-row self-center p-1 rounded-full bg-background-muted">
					{searchTabs.map(({ label, icon }, index) => (
						<Pressable
							key={label}
							onPress={() => {
								onTabChange(index);
							}}
							className={cn(
								' px-4 rounded-full py-2  flex-row gap-1 items-center',
								activeIndex === index && 'bg-primary'
							)}>
							<Icon
								as={icon}
								className={cn(activeIndex === index ? `text-white` : ` `)}
							/>
							<Heading
								className={cn(
									' text-sm',
									activeIndex === index && 'text-white'
								)}>
								{label}
							</Heading>
						</Pressable>
					))}
				</View>
			</SafeAreaView>
		</View>
	);
}

export const searchTabs = [
	{
		label: 'Map View',
		icon: Map,
		key: 'map',
	},
	{
		label: 'List View',
		icon: ListOrdered,
		key: 'list',
	},
];
