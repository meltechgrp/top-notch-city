import { useSharedValue } from 'react-native-reanimated';
import { Slider as Sl } from 'react-native-awesome-slider';
import { View } from '../view';
import { Text } from '../text';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { cn } from '@/lib/utils';

type Props = {
	value: number;
	onChange: (value: number) => void;
	minValue: number;
	maxValue: number;
	steps?: number;
};

export const Slider = ({
	value,
	onChange,
	minValue,
	maxValue,
	steps = 5,
}: Props) => {
	const progress = useSharedValue(value);
	const min = useSharedValue(minValue);
	const max = useSharedValue(maxValue);

	return (
		<Sl
			progress={progress}
			minimumValue={min}
			maximumValue={max}
			steps={steps}
			disableTapEvent={true}
			forceSnapToStep
			renderMark={({ index }) => (
				<View className={cn('w-2 h-2 bg-primary rounded-full')}></View>
			)}
			onHapticFeedback={() => {
				Haptics.selectionAsync();
			}}
			hapticMode="step"
			theme={{
				// disableMinTrackTintColor: '#fff',
				// maximumTrackTintColor: Colors.,
				minimumTrackTintColor: Colors.primary,
				// bubbleBackgroundColor: '#666',
				// heartbeatColor: '#999',
			}}
			onValueChange={onChange}
		/>
	);
};
