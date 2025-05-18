import * as React from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

const videoSource = require('@/assets/images/splash-video.mp4');

export default function SplashScreen() {
	const player = useVideoPlayer(videoSource, (player) => {
		// Remove looping so it ends
		player.loop = false;
		player.play();
	});

	// Navigate when video ends
	React.useEffect(() => {
		if (!player) return;

		const onEnded = () => {
			router.replace('/onboarding');
		};

		player.addListener('playToEnd', onEnded);

		return () => {
			player.addListener('playToEnd', onEnded);
		};
	}, [player]);

	return (
		<View style={styles.container}>
			<VideoView
				style={StyleSheet.absoluteFill}
				player={player}
				nativeControls={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
