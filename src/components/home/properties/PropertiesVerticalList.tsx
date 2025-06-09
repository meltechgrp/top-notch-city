import { useEffect } from 'react';
import { ImageSourcePropType, ScrollView } from 'react-native';
import { useRefresh } from '@react-native-community/hooks';
import eventBus from '@/lib/eventBus';
import PropertyListItem from '@/components/property/PropertyListItem';

type Props = {
	category?: string;
	fullWidth?: boolean;
	emptyState?: React.ReactNode;
};

export type Property = {
	id: string;
	name: string;
	location: string;
	price: number;
	banner: ImageSourcePropType;
	images: string[];
};
export default function TopPropertiesVerticalList(props: Props) {
	return (
		<ScrollView
			// horizontal
			contentContainerClassName="gap-y-4 px-4"
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			snapToInterval={238 + 4}
			snapToAlignment="center"
			decelerationRate="fast">
			{/* {data.map((location) => (
				<PropertyListItem
					className="w-full"
					data={location as any}
					key={location.id}
					showFacilites={true}
				/>
			))} */}
		</ScrollView>
	);
}
