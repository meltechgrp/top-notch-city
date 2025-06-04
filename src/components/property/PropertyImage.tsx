import { generateMediaUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { type ImageStyle, type StyleProp, type ViewProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { View } from '../ui';

interface Props extends AnimatedProps<ViewProps> {
	style?: StyleProp<ImageStyle>;
	index?: number;
	rounded?: boolean;
	source: string;
	withBackdrop?: boolean;
}

export const PropertyImage: React.FC<Props> = (props) => {
	const {
		style,
		index = 0,
		rounded = false,
		withBackdrop = false,
		testID,
		...animatedViewProps
	} = props;

	const source = useMemo(() => generateMediaUrl(props.source), [props.source]);

	return (
		<Animated.View
			testID={testID}
			className={' relative'}
			style={{ flex: 1 }}
			{...animatedViewProps}>
			<Animated.Image
				style={[style]}
				className={cn('w-full h-full', rounded && ' rounded-xl')}
				source={{ uri: source }}
				resizeMode="cover"
			/>
			{withBackdrop && (
				<View className=" absolute w-full h-full z-20 bg-black/20" />
			)}
		</Animated.View>
	);
};
