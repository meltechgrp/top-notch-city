import { View } from '@/components/ui';
import Layout from '@/constants/Layout';
import Map from '../location/map';

type Props = {
	className?: string;
};
export default function DiscoverProperties(props: Props) {
	const { className } = props;
	const mapHeight = Layout.window.height / 1.5;
	return (
		<View className={className}>
			<View className="overflow-hidden flex-1">
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
