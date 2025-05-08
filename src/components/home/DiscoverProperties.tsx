import { View } from '@/components/ui';
import Layout from '@/constants/Layout';
import Map from '../location/map';
import FoundHorizontalList from './FoundProperties';
import HomeNavigation from './HomeNavigation';
import { markersMapData } from '@/constants/DeleteLater';
import { useRouter } from 'expo-router';

type Props = {
	className?: string;
};
export default function DiscoverProperties(props: Props) {
	const { className } = props;
	const router = useRouter();
	const mapHeight = Layout.window.height / 1.8;
	return (
		<View className={className}>
			<View
				className="overflow-hidden relative flex-1"
				style={{ height: mapHeight }}>
				<View className="  absolute top-16 w-full z-10">
					<HomeNavigation />
				</View>
				<View className="absolute bottom-8 z-10">
					<FoundHorizontalList />
				</View>
				<Map
					markers={markersMapData}
					scrollEnabled={true}
					showUserLocation={true}
					height={mapHeight}
					onMarkerPress={(data) =>
						router.push({
							pathname: '/(protected)/search',
							params: {
								propertyId: data.id,
							},
						})
					}
				/>
			</View>
		</View>
	);
}
