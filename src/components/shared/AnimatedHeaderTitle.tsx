import React from 'react';
import Animated, {
	FadeInUp,
	FadeOutUp,
	FadeInDown,
	FadeOutDown,
} from 'react-native-reanimated';
import { View, StyleSheet, Dimensions } from 'react-native';

interface AnimatedHeaderTitleProps {
	title: string;
	defaultTitle: string;
}

const HEADER_WIDTH = Dimensions.get('window').width - 100;

export function AnimatedHeaderTitle({
	title,
	defaultTitle,
}: AnimatedHeaderTitleProps) {
	const isProfile = title === defaultTitle;

	return (
		<View key={title} style={styles.wrapper}>
			<Animated.Text
				entering={isProfile ? FadeInUp.duration(500) : FadeInDown.duration(500)}
				exiting={
					isProfile ? FadeOutUp.duration(500) : FadeOutDown.duration(500)
				}
				className={'text-typography'}
				style={[
					styles.title,
					{
						fontSize: isProfile ? 20 : 18,
					},
				]}>
				{title}
			</Animated.Text>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		width: HEADER_WIDTH,
		alignSelf: 'center',
	},
	title: {
		textAlign: 'center',
		fontWeight: '600',
	},
});
