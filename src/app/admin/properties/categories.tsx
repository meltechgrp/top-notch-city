import CategoryBottomSheet from '@/components/admin/properties/CategoryBottomSheet';
import CategoryItem from '@/components/admin/properties/CategoryItem';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, View, Button, Icon, Heading } from '@/components/ui';
import { useApiRequest, useGetApiQuery } from '@/lib/api';
import eventBus from '@/lib/eventBus';
import { showSnackbar } from '@/lib/utils';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, RefreshControl } from 'react-native';

export default function Categories() {
	const router = useRouter();
	const { request, loading: loader, error } = useApiRequest();
	const [refetching, setRefetching] = useState(false);
	const [category, setCategory] = useState('');
	const { data, loading, refetch } = useGetApiQuery<Category[]>('/categories');
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);

	const categories = useMemo(() => {
		return data ?? [];
	}, [data]);
	async function onRefresh() {
		try {
			setRefetching(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefetching(false);
		}
	}
	useEffect(() => {
		const backAction = () => {
			router.replace('/admin/properties');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);

	async function newHandler() {
		await request({
			url: '/categories',
			method: 'POST',
			data: { name: category },
		});
		if (data) {
			setCategoryBottomSheet(false);
			await refetch();
		} else {
			showSnackbar({
				message: 'Something went wrong!, Try again..',
				type: 'error',
			});
		}
	}
	return (
		<>
			<Stack.Screen
				options={{
					gestureDirection: 'vertical',
					gestureEnabled: false,
					headerRight: () => (
						<View>
							<Pressable
								onPress={() => {
									setCategory('');
									setCategoryBottomSheet(true);
								}}
								className="p-2 mr-3 bg-background-muted rounded-full">
								<Icon size="xl" as={Plus} className="text-primary" />
							</Pressable>
						</View>
					),
				}}
			/>
			<Box className="flex-1 py-4">
				<EmptyStateWrapper
					loading={loading || refetching || loader}
					refreshControl={
						<RefreshControl refreshing={refetching} onRefresh={onRefresh} />
					}
					isEmpty={!categories.length}
					illustration={
						<View className=" bg-background-muted p-6 gap-4 rounded-xl">
							<Heading size="2xl">No categories found!</Heading>
							<Button
								onPress={() => {
									setCategory('');
									setCategoryBottomSheet(true);
								}}
								className="px-2 h-14 aspect-square self-center rounded-full">
								<Icon size="xl" as={Plus} className="text-white" />
							</Button>
						</View>
					}>
					<FlashList
						data={categories}
						keyExtractor={(item) => item.id}
						estimatedItemSize={200}
						refreshing={loading}
						onScroll={() => eventBus.dispatchEvent('SWIPEABLE_OPEN', null)}
						refreshControl={
							<RefreshControl refreshing={loading} onRefresh={onRefresh} />
						}
						ListHeaderComponent={() => (
							<View className="py-4 px-6 pt-0">
								<Heading size="xl">
									Property{' '}
									<Heading size="xl" className="text-primary">
										Categories
									</Heading>
								</Heading>
							</View>
						)}
						ItemSeparatorComponent={() => <View className="h-2" />}
						renderItem={({ item }) => (
							<CategoryItem refetch={refetch} item={item} />
						)}
					/>
				</EmptyStateWrapper>
			</Box>
			<CategoryBottomSheet
				visible={categoryBottomSheet}
				onDismiss={() => setCategoryBottomSheet(false)}
				onSubmit={newHandler}
				type="add"
				loading={loader}
				onUpdate={setCategory}
				category={category}
			/>
		</>
	);
}
