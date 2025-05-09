import { useSharedValue } from 'react-native-reanimated';
import { Slider as Sl } from 'react-native-awesome-slider';
import { View } from '../view';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/layouts/ThemeProvider';

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
	steps = 8,
}: Props) => {
	const { theme } = useTheme();
	const progress = useSharedValue(value);
	const min = useSharedValue(minValue);
	const max = useSharedValue(maxValue);

	return (
		<Sl
			progress={progress}
			minimumValue={min}
			maximumValue={max}
			steps={steps}
			forceSnapToStep
			renderMark={({ index }) => (
				<View
					className={cn(
						'w-2 h-2 bg-primary rounded-full',
						value > index * (maxValue / steps)
							? 'bg-primary'
							: 'bg-background-info'
					)}></View>
			)}
			onHapticFeedback={() => {
				Haptics.selectionAsync();
			}}
			hapticMode="step"
			theme={{
				// disableMinTrackTintColor: '#fff',
				maximumTrackTintColor:
					theme == 'light' ? 'rgb(249, 249, 249)' : 'rgb(36, 37, 41)',
				minimumTrackTintColor: Colors.primary,
				bubbleBackgroundColor: Colors.primary,
				// heartbeatColor: '#999',
			}}
			onValueChange={onChange}
		/>
	);
};
