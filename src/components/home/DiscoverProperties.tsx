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
	const mapHeight = Layout.window.height / 1.65;
	return (
		<View className={className}>
			<View className="overflow-hidden flex-1">
				<View
					className=" absolute bottom-10 z-10 justify-between flex-1"
					style={{ height: mapHeight / 1.3 }}>
					<HomeNavigation />
					<FoundHorizontalList />
				</View>
				<Map
					scrollEnabled={false}
					showUserLocation={true}
					height={mapHeight}
					user={{ fullName: 'Humphrey' }}
				/>
			</View>
		</View>
	);
}
