import { View } from '@/components/ui';
import Layout from '@/constants/Layout';
import Map from '../location/map';
import FoundHorizontalList from './FoundProperties';
import HomeNavigation from './HomeNavigation';

type Props = {
	className?: string;
};
export default function DiscoverProperties(props: Props) {
	const { className } = props;
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
				<Map scrollEnabled={true} showUserLocation={true} height={mapHeight} />
			</View>
		</View>
	);
}
