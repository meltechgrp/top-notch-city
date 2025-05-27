import { View } from 'react-native';
import { Text } from '../ui';
import BeachPersonWaterParasolIcon from '../icons/BeachPersonWaterParasolIcon';

interface Props {
	title: string;
}

export function MiniEmptyState({ title }: Props) {
	return (
		<View className="flex-1 items-center justify-center pt-20">
			<View>
				<BeachPersonWaterParasolIcon
					height={64}
					width={64}
					className="text-primary"
				/>
			</View>
			<Text className=" text-md text-center pt-2">{title}</Text>
		</View>
	);
}
