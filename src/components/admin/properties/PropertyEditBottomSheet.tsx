import { useState } from 'react';
import { View, Pressable, Text } from '@/components/ui';
import withRenderVisible from '@/components/shared/withRenderOpen';
import BottomSheet from '@/components/shared/BottomSheet';
import { useLayout } from '@react-native-community/hooks';
import clsx from 'clsx';

type PropertyEditBottomSheetProps = {
	visible: boolean;
	property: Property;
	onDismiss: () => void;
};

const tabs = [
	{ key: 'basic', label: 'Basic Info' },
	{ key: 'category', label: 'Category' },
	{ key: 'description', label: 'Description' },
	{ key: 'media', label: 'Media' },
	{ key: 'amenities', label: 'Amenities' },
];

function PropertyEditBottomSheet(props: PropertyEditBottomSheetProps) {
	const { visible, property, onDismiss } = props;
	const { width, onLayout } = useLayout();
	const [activeTab, setActiveTab] = useState('basic');

	const HeaderRightComponent = (
		<Pressable onPress={() => {}} className="self-end">
			<Text className="text-primary font-semibold">Updated</Text>
		</Pressable>
	);

	const renderTabContent = () => {
		switch (activeTab) {
			case 'basic':
				return (
					<View className="gap-4">
						<Text>Title: {property.title}</Text>
						{/* Add form for title, price, purpose, etc. */}
					</View>
				);
			case 'category':
				return (
					<View className="gap-4">
						<Text>Category: </Text>
						{/* Add form for category/subcategory selection */}
					</View>
				);
			case 'description':
				return (
					<View className="gap-4">
						<Text>Description</Text>
						{/* Add multiline input for description */}
					</View>
				);
			case 'media':
				return (
					<View className="gap-4">
						<Text>Photos & Videos</Text>
						{/* Add image/video uploader */}
					</View>
				);
			case 'amenities':
				return (
					<View className="gap-4">
						<Text>Amenities</Text>
						{/* Add amenity selector component */}
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<BottomSheet
			title="Edit Property"
			onDismiss={onDismiss}
			visible={visible}
			withHeader
			HeaderRightComponent={HeaderRightComponent}
			withScroll={true}
			snapPoint={720}>
			<View onLayout={onLayout} className="flex-1 px-4 pb-32 mt-4">
				{/* Tabs */}
				<View className="flex-row mb-4 border-b border-outline-200">
					{tabs.map((tab) => (
						<Pressable
							key={tab.key}
							onPress={() => setActiveTab(tab.key)}
							className={clsx(
								'px-3 py-2 border-b-2',
								activeTab === tab.key ? 'border-primary' : 'border-transparent'
							)}>
							<Text
								className={clsx(
									'text-sm font-medium',
									activeTab === tab.key
										? 'text-primary'
										: 'text-typography-muted'
								)}>
								{tab.label}
							</Text>
						</Pressable>
					))}
				</View>

				{/* Tab content */}
				{renderTabContent()}
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(PropertyEditBottomSheet);
