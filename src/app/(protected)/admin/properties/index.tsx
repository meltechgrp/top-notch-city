import { Box, View } from '@/components/ui';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Icon, AddIcon } from '@/components/ui/icon';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import eventBus from '@/lib/eventBus';
import { MiniEmptyState } from '@/components/shared/MiniEmptyState';
import { FilterComponent } from '@/components/admin/shared/FilterComponent';
import { useMemo, useState } from 'react';
import { useGetApiQuery } from '@/lib/api';
import PropertyListItem from '@/components/admin/properties/PropertyListItem';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import PropertyBottomSheet from '@/components/admin/properties/PropertyBottomSheet';

const ITEMS_PER_PAGE = 50;

export default function Properties() {
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [activeProperty, setActiveProperty] = useState<Property | null>(null);
	const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
	const [actveTab, setActiveTab] = useState<Property['status'] | 'all'>('all');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const { data, loading, error, refetch } =
		useGetApiQuery<PropertyResponse>('/properties');

	const propertysData = useMemo(() => {
		return data?.properties ?? [];
	}, [data]);
	const filteredData = useMemo(() => {
		let filtered = propertysData;

		if (actveTab !== 'all') {
			if (actveTab == 'pending')
				filtered = filtered.filter((u) => u.status == actveTab);
			else if (actveTab == 'approve')
				filtered = filtered.filter((u) => u.status === actveTab);
			else if (actveTab == 'sold')
				filtered = filtered.filter((u) => u.status === actveTab);
		}

		// Search by title
		if (search.trim() !== '') {
			const regex = new RegExp(search.trim(), 'i');
			filtered = filtered.filter(
				(u) =>
					regex.test(u.title) ||
					regex.test(u.category) ||
					regex.test(u.subcategory)
			);
		}

		const start = (page - 1) * ITEMS_PER_PAGE;
		return filtered;
		// return filtered.slice(start, start + ITEMS_PER_PAGE);
	}, [propertysData, actveTab, search]);

	const tabs = useMemo(() => {
		const all = propertysData.length;

		const approved = propertysData.filter(
			(property) => property.status == 'approve'
		).length;
		const pending = propertysData.filter(
			(property) => property.status === 'pending'
		).length;
		const sold = propertysData.filter(
			(property) => property.status === 'sold'
		).length;
		return [
			{ title: 'all', total: all },
			{ title: 'pending', total: pending },
			{ title: 'approved', total: approved },
			{ title: 'sold', total: sold },
			// { title: 'banned', total: 0 },
		];
	}, [propertysData]);

	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}
	const headerComponent = useMemo(() => {
		return (
			<FilterComponent
				search={search}
				onSearch={setSearch}
				onUpdate={(tab: any) => setActiveTab(tab)}
				searchPlaceholder="Search by name or city"
				tabs={tabs}
				tab={actveTab}
			/>
		);
	}, [tabs, actveTab, search, setSearch]);

	useRefreshOnFocus(refetch);
	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<View>
							<Menu
								placement="bottom"
								offset={5}
								className="bg-background-muted gap-2"
								trigger={({ ...triggerProps }) => {
									return (
										<Button
											variant="link"
											className="px-4 bg-transparent"
											{...triggerProps}>
											<Icon size="xl" as={MoreHorizontal} />
										</Button>
									);
								}}>
								<MenuItem
									className="bg-background rounded-xl"
									key="category"
									onPress={() => router.push('/admin/properties/categories')}
									textValue="category">
									<Icon as={AddIcon} size="md" className="mr-2" />
									<MenuItemLabel
										size="md"
										className="font-medium text-typography">
										Categories
									</MenuItemLabel>
									<View className="ml-auto">
										<Icon as={ChevronRight} />
									</View>
								</MenuItem>
								<MenuItem
									className="bg-background rounded-xl"
									key="Add property"
									onPress={() => router.replace('/sell')}
									textValue="Add property">
									<Icon as={AddIcon} size="md" className="mr-2" />
									<MenuItemLabel
										size="md"
										className="font-medium text-typography">
										Add Property
									</MenuItemLabel>
									<View className="ml-auto">
										<Icon as={ChevronRight} />
									</View>
								</MenuItem>
							</Menu>
						</View>
					),
				}}
			/>
			<Box className=" flex-1 px-2 pt-2">
				<View className="flex-1">
					<FlashList
						data={filteredData}
						keyExtractor={(item) => item.id}
						estimatedItemSize={200}
						keyboardDismissMode="on-drag"
						onScroll={() => eventBus.dispatchEvent('SWIPEABLE_OPEN', null)}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						ListEmptyComponent={<MiniEmptyState title="No propeerty found" />}
						ItemSeparatorComponent={() => <View className="h-2" />}
						renderItem={({ item }) => (
							<PropertyListItem
								property={item}
								onPress={(property) => {
									// setActiveProperty(property);
									// setPropertyBottomSheet(true);
								}}
							/>
						)}
						ListHeaderComponent={headerComponent}
					/>
				</View>
				{activeProperty && (
					<PropertyBottomSheet
						visible={propertyBottomSheet}
						property={activeProperty}
						onDismiss={() => setPropertyBottomSheet(false)}
					/>
				)}
			</Box>
		</>
	);
}
