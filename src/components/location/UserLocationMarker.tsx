import { Animated, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

type Props = {
	userLocation: {
		latitude: number;
		longitude: number;
	};
	heading: number;
};

export default function UserLocationMarker({ userLocation, heading }: Props) {
	return (
		<Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
			<View style={styles.outer}>
				<View style={styles.inner} />
				<Animated.View
					style={[
						styles.arrow,
						{
							transform: [{ rotate: `${heading}deg` }],
						},
					]}
				/>
			</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	outer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(0, 122, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inner: {
		width: 20,
		height: 20,
		backgroundColor: '#007AFF',
		borderRadius: 10,
	},
	arrow: {
		width: 0,
		height: 0,
		position: 'absolute',
		bottom: -5,
		left: '50%',
		marginLeft: -6,
		borderLeftWidth: 6,
		borderRightWidth: 6,
		borderBottomWidth: 10,
		borderStyle: 'solid',
		backgroundColor: 'transparent',
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: '#007AFF',
	},
});
