import { useEffect, useMemo, useState } from 'react';
import Map from '../location/map';
import { View } from '../ui';
import PropertyBottomSheet from '../location/PropertyBottomSheet';

type Props = {
	properties: Property[];
	height: number;
	propertyId?: string;
};

export function SearchMapView({ properties, height, propertyId }: Props) {
	const [selectedItem, setSeletedItem] = useState<Property | null>(null);

	useEffect(() => {
		if (propertyId && properties.length > 0) {
			setSeletedItem(properties.find((item) => item.id == propertyId) || null);
		}
	}, [propertyId]);
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
