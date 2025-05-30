import CategoryBottomSheet from '@/components/admin/properties/CategoryBottomSheet';
import SubCategoryItem from '@/components/admin/properties/SubCategoryItem';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, View, Button, Icon, Heading } from '@/components/ui';
import { useApiRequest, useGetApiQuery } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { capitalize } from 'lodash-es';
import { Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { BackHandler, RefreshControl } from 'react-native';

export default function SubCategories() {
	const router = useRouter();
	const { catId, catName } = useLocalSearchParams() as {
		catId: string;
		catName: string;
	};
	const { request, loading: loader, error } = useApiRequest();
	const [refetching, setRefetching] = useState(false);
	const [subCategory, setSubCategory] = useState('');
	const [subBottomSheet, setSubBottomSheet] = useState(false);
	const { data, loading, refetch } = useGetApiQuery<SubCategory[]>(
		`/categories/${catId}/subcategories`
	);

	const subCategories = useMemo(() => {
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
			router.replace('/admin/properties/categories');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);
	useEffect(() => {
		if (!catId) return router.push('/admin/properties/categories');
	}, []);

	async function newHandler() {
		await request({
			url: `/categories/${catId}/subcategories`,
			method: 'POST',
			data: { name: subCategory, category_id: catId },
		});
		if (data) {
			setSubBottomSheet(false);
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
					headerTitle: capitalize(catName),
					headerRight: () => (
						<View>
							<Button
								onPress={() => {
									setSubCategory('');
									setSubBottomSheet(true);
								}}
								variant="link"
								className="p-2 mr-3 bg-background-muted rounded-full">
								<Icon size="xl" as={Plus} className="text-primary" />
							</Button>
						</View>
					),
				}}
			/>
			<Box className="flex-1 py-4">
				<EmptyStateWrapper
					loading={loading}
					refreshControl={
						<RefreshControl refreshing={loading} onRefresh={onRefresh} />
					}
					isEmpty={!subCategories.length}
					illustration={
						<View className=" bg-background-muted p-6 gap-4 rounded-xl">
							<View className=" justify-center items-center">
								<Heading size="xl">No sub-categories</Heading>
								<Heading size="xl">found!</Heading>
							</View>
							<Button
								onPress={() => {
									setSubCategory('');
									setSubBottomSheet(true);
								}}
								className="px-2 h-14 aspect-square self-center rounded-full">
								<Icon size="xl" as={Plus} className="text-white" />
							</Button>
						</View>
					}>
					<FlashList
						data={subCategories}
						keyExtractor={(item) => item.id}
						estimatedItemSize={200}
						refreshing={loading}
						refreshControl={
							<RefreshControl refreshing={refetching} onRefresh={onRefresh} />
						}
						ListHeaderComponent={() => (
							<View className="py-4 px-6 pt-0">
								<Heading size="xl" className="capitalize">
									{catName} Sub{' '}
									<Heading size="xl" className="text-primary">
										Categories
									</Heading>
								</Heading>
							</View>
						)}
						ItemSeparatorComponent={() => <View className="h-4" />}
						renderItem={({ item }) => (
							<SubCategoryItem refetch={refetch} catId={catId} item={item} />
						)}
					/>
				</EmptyStateWrapper>
			</Box>
			<CategoryBottomSheet
				visible={subBottomSheet}
				onDismiss={() => setSubBottomSheet(false)}
				onSubmit={newHandler}
				loading={loader}
				type="add"
				onUpdate={setSubCategory}
				category={subCategory}
			/>
		</>
	);
}
