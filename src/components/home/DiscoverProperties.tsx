import { Card, Text, View } from '@/components/ui';
import Layout from '@/constants/Layout';
import Map from '../location/map';
import FoundHorizontalList from './FoundProperties';
import HomeNavigation from './HomeNavigation';
import { MapPin } from 'lucide-react-native';
import { Icon } from '../ui/icon';

type Props = {
	className?: string;
};
export default function DiscoverProperties(props: Props) {
	const { className } = props;
	const mapHeight = Layout.window.height / 1.65;
	return (
		<View className={className}>
			<View className="overflow-hidden flex-1" style={{ height: mapHeight }}>
				<View
					className=" absolute bottom-10 z-10 justify-between flex-1"
					style={{ height: mapHeight / 1.3 }}>
					<HomeNavigation />
					<View className="gap-2">
						<Card className="flex-row items-center p-2 max-w-[15rem] w-fit mx-4 gap-2 rounded-2xl">
							<Icon as={MapPin} className="text-[#F8AA00]" />
							<Text numberOfLines={1} className="text-base">
								Port Harcourt, Rivers
							</Text>
						</Card>
						<FoundHorizontalList />
					</View>
				</View>
				<Map scrollEnabled={false} showUserLocation={true} height={mapHeight} />
			</View>
		</View>
	);
}
