import { View } from '@/components/ui';
import Layout from '@/constants/Layout';
import Map from '../location/map';
import FoundHorizontalList from './FoundProperties';
import HomeNavigation from './HomeNavigation';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getLocationFromIP } from '@/actions/utills';

type Props = {
	className?: string;
};
export default function DiscoverProperties(props: Props) {
	const { className } = props;
	const router = useRouter();
	const { data, refetch } = useQuery({
		queryKey: ['nearby'],
		queryFn: getLocationFromIP,
	});
	const mapHeight = Layout.window.height / 1.8;
	return (
		<View style={{ minHeight: mapHeight }} className={className}>
			<View className="overflow-hidden relative flex-1">
				<View className="  absolute top-16 w-full z-10">
					<HomeNavigation />
				</View>
				<View className="absolute bottom-8 z-10">
					<FoundHorizontalList data={data} refetch={refetch} />
				</View>
				<Map
					markers={data || []}
					scrollEnabled={true}
					showUserLocation={true}
					height={mapHeight}
					onMarkerPress={(data) =>
						router.push({
							pathname: '/(protected)/property/[propertyId]',
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
