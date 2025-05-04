import { AlignVerticalSpaceAround, LayoutGrid } from 'lucide-react-native';
import { Text, View } from '../ui';
import { cn } from '@/lib/utils';
import { TouchableOpacity } from 'react-native';

type Props = {
	total: number;
	toggleView: () => void;
	numColumns: number;
};

export default function DisplayStyle({
	total = 0,
	toggleView,
	numColumns,
}: Props) {
	function handleToggleView() {
		toggleView();
	}
	return (
		<View className=" flex-row mb-4 w-full justify-between items-center">
			<View className="flex-row gap-2 items-center">
				<Text size="xl" className="font-heading">
					{total}
				</Text>
				<Text>Properties</Text>
			</View>
			<View className="flex-row gap-2 bg-gray-200 rounded-[50px] p-2">
				<TouchableOpacity
					onPress={handleToggleView}
					className={cn(
						'rounded-[50px] p-2 px-4',
						numColumns == 2 && 'bg-white text-black'
					)}>
					<LayoutGrid size={18} color={numColumns == 2 ? 'black' : 'gray'} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleToggleView}
					className={cn(
						'rounded-[50px] p-2 px-4',
						numColumns == 1 && 'bg-white text-black'
					)}>
					<AlignVerticalSpaceAround
						size={18}
						color={numColumns == 1 ? 'black' : 'gray'}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
