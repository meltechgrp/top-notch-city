import { AlignVerticalSpaceAround, LayoutGrid } from 'lucide-react-native';
import { Badge, Text, View } from '../ui';
import { cn } from '@/lib/utils';
import { TouchableOpacity } from 'react-native';

type Props = {
	total: number;
	toggleView: () => void;
	numColumns: number;
	disableCount: boolean;
};

export default function DisplayStyle({
	total = 0,
	toggleView,
	numColumns,
	disableCount,
}: Props) {
	function handleToggleView() {
		toggleView();
	}
	return (
		<View
			className={cn(
				' flex-row mb-4 w-full justify-between items-center',
				disableCount && 'justify-end'
			)}>
			{!disableCount && (
				<View className="flex-row gap-2 items-center">
					<Text size="xl" className="font-heading">
						{total}
					</Text>
					<Text>Properties</Text>
				</View>
			)}
			<Badge className="flex-row gap-2 rounded-[50px] p-2">
				<TouchableOpacity
					onPress={handleToggleView}
					className={cn(
						'rounded-[50px] p-2 px-4',
						numColumns == 1 && 'bg-primary'
					)}>
					<AlignVerticalSpaceAround
						size={18}
						color={numColumns == 1 ? 'white' : 'gray'}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleToggleView}
					className={cn(
						'rounded-[50px] p-2 px-4',
						numColumns == 2 && 'bg-primary'
					)}>
					<LayoutGrid size={18} color={numColumns == 2 ? 'white' : 'gray'} />
				</TouchableOpacity>
			</Badge>
		</View>
	);
}
