import { generateMediaUrl } from '@/lib/api';
import React, { useMemo } from 'react';
import { type ImageStyle, type StyleProp, type ViewProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

interface Props extends AnimatedProps<ViewProps> {
	style?: StyleProp<ImageStyle>;
	index?: number;
	rounded?: boolean;
	source: string;
}

export const PropertyImage: React.FC<Props> = (props) => {
	const {
		style,
		index = 0,
		rounded = false,
		testID,
		...animatedViewProps
	} = props;

	const source = useMemo(() => generateMediaUrl(props.source), [props.source]);

	return (
		<Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
			<Animated.Image
				style={[style]}
				className={'w-full h-full rounded-xl'}
				source={{ uri: source }}
				resizeMode="cover"
			/>
		</Animated.View>
	);
};
