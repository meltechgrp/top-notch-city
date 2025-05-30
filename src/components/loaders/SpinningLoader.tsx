import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { Loader } from 'lucide-react-native';

type Props = {
	color?: string;
	size?: number;
};

export const SpinningLoader = ({ color = '#fff', size = 24 }: Props) => {
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 800,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();
	}, []);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return (
		<Animated.View style={{ transform: [{ rotate: spin }] }}>
			<Loader color={color} size={size} />
		</Animated.View>
	);
};
