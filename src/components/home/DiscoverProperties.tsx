import { View } from '@/components/ui';
import Layout from '@/constants/Layout';
import Map from '../location/map';
import FoundHorizontalList from './FoundProperties';
import HomeNavigation from './HomeNavigation';
import { useRouter } from 'expo-router';
import { useProductQueries } from '@/tanstack/queries/useProductQueries';
import { useMemo } from 'react';

type Props = {
	className?: string;
};
export default function DiscoverProperties(props: Props) {
	const { className } = props;
	const router = useRouter();
		const {
			data,
			refetch,
		} = useProductQueries({ type: 'search', filter: { use_geo_location: 'true' }, key: 'nearby', enabled: false });

			const properties = useMemo(
				() => data?.pages.flatMap((page) => page.results) || [],
				[data]
			);
			const location  = useMemo(()=> data?.pages[0].user_location,[data])
	const mapHeight = Layout.window.height / 1.8;
	return (
		<View style={{ minHeight: mapHeight }} className={className}>
			<View className="overflow-hidden relative flex-1">
				<View className="  absolute top-16 w-full z-10">
					<HomeNavigation />
				</View>
				<View className="absolute bottom-8 z-10">
					<FoundHorizontalList data={properties} refetch={refetch} />
				</View>
				<Map
					markers={properties || []}
					latitude={location?.latitude}
					longitude={location?.longitude}
					height={mapHeight}
					onDoublePress={() =>
						router.push({
							pathname: '/search',
							params: {
								search: 'true',
							},
						})
					}
					onMarkerPress={(data) =>
						router.push({
							pathname: '/search',
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
