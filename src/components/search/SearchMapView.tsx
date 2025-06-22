import { useMemo, useState } from 'react';
import Map from '../location/map';
import { View } from '../ui';
import PropertyBottomSheet from '../location/PropertyBottomSheet';

type Props = {
	properties: Property[];
	height: number;
};

export function SearchMapView({ properties, height }: Props) {
	const [selectedItem, setSeletedItem] = useState<Property | null>(null);
	return (
		<>
			<View className="flex-1">
				<Map
					scrollEnabled={true}
					height={height}
					markers={properties}
					onMarkerPress={(marker) => setSeletedItem(marker)}
				/>
			</View>
			{selectedItem && (
				<PropertyBottomSheet
					visible={!!selectedItem}
					data={selectedItem}
					onDismiss={() => setSeletedItem(null)}
				/>
			)}
		</>
	);
}
