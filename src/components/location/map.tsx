import { memo, useMemo } from 'react';
import { Platform, View } from 'react-native';
import MapView, { MapMarker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import {
	Avatar,
	AvatarBadge,
	AvatarFallbackText,
	AvatarImage,
} from '@/components/ui';
import Layout from '@/constants/Layout';

interface MapProps {
	latitude?: number;
	longitude?: number;
	height?: number;
	showUserLocation?: boolean;
	scrollEnabled?: boolean;
	user: {
		fullName: string;
		photoPath?: string;
	};
}
const DEFAULT_LAT_DELTA = 0.0922;
const DEFAULT_LONG_DELTA = 0.0421;
export default function Map(props: MapProps) {
	const {
		latitude,
		longitude,
		height,
		scrollEnabled = true,
		showUserLocation = false,
	} = props;

	const initialRegion = useMemo(
		() => ({
			latitude: latitude || 4.8156,
			longitude: longitude || 7.0498,
			latitudeDelta: DEFAULT_LONG_DELTA,
			longitudeDelta: DEFAULT_LAT_DELTA,
		}),
		[latitude, longitude]
	);

	return (
		<MapView
			style={{ width: '100%', height: height || Layout.window.height }}
			provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
			onMapLoaded={() => console.log('Map loaded')}
			zoomEnabled
			loadingEnabled
			showsUserLocation={showUserLocation}
			scrollEnabled={scrollEnabled}
			region={initialRegion}>
			{latitude !== undefined && longitude !== undefined && (
				<MapMarker
					coordinate={{
						latitude,
						longitude,
					}}
					icon={undefined}>
					<LiveWaveMoti
						fullName={props.user.fullName}
						photoPath={props.user.photoPath}
					/>
				</MapMarker>
			)}
		</MapView>
	);
}

type LiveWaveMotiProps = {
	fullName: string;
	photoPath?: string;
};

const WaveComp = ({ index }: { index: number }) => {
	return (
		<MotiView
			className="w-10 h-10 rounded-full bg-primary-900 inset-0 absolute"
			key={index}
			from={{ opacity: 0.7, scale: 1 }}
			animate={{ opacity: 0, scale: 2 }}
			transition={{
				type: 'timing',
				easing: Easing.out(Easing.ease),
				delay: index * 400,
				loop: true,
				repeatReverse: false,
				duration: 2000,
			}}
		/>
	);
};

const Waves = memo(() => {
	return Array.from({ length: 3 }, (_, i) => <WaveComp index={i} key={i} />);
});

const LiveWaveMoti: React.FC<LiveWaveMotiProps> = (props) => {
	return (
		<View className="items-center justify-center relative">
			<View className="w-10 h-10 rounded-full bg-primary-900 absolute inset-0 items-center justify-center z-10">
				<Avatar size="md">
					<AvatarFallbackText>{props.fullName}</AvatarFallbackText>
					<AvatarImage
						source={{
							uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
						}}
					/>
					<AvatarBadge />
				</Avatar>
			</View>
			<Waves />
		</View>
	);
};
