import { getSubCategories, newSubCategory } from '@/actions/property';
import CategoryBottomSheet from '@/components/admin/properties/CategoryBottomSheet';
import SubCategoryItem from '@/components/admin/properties/SubCategoryItem';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, View, Button, Icon, Heading } from '@/components/ui';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { capitalize } from 'lodash-es';
import { Plus } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, RefreshControl } from 'react-native';

export default function SubCategories() {
	const router = useRouter();
	const { catId, catName } = useLocalSearchParams() as {
		catId: string;
		catName: string;
	};
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [category, setCategory] = useState('');
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);

	const getCats = useCallback(async () => {
		const update: Category[] = [];
		setLoading(true);
		const res = await getSubCategories(catId);
		res.map((item) => {
			update.push({ id: item.id, name: item.name, slug: item.slug });
		});
		setCategories(update);
		setLoading(false);
	}, [catId, categories]);

	useEffect(() => {
		getCats();
	}, [catId]);

	async function onRefresh() {
		try {
			setLoading(true);
			await getCats();
		} catch (error) {
		} finally {
			setLoading(false);
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
		try {
			setLoading(true);
			await newSubCategory(catId, category);
		} catch {
		} finally {
			setLoading(false);
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
									setCategory('');
									setCategoryBottomSheet(true);
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
					isEmpty={!categories.length}
					illustration={
						<View className=" bg-background-muted p-6 gap-4 rounded-xl">
							<View className=" justify-center items-center">
								<Heading size="xl">No sub-categories</Heading>
								<Heading size="xl">found!</Heading>
							</View>
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
						refreshControl={
							<RefreshControl refreshing={loading} onRefresh={onRefresh} />
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
							<SubCategoryItem
								onRefresh={onRefresh}
								catId={catId}
								item={item}
							/>
						)}
					/>
				</EmptyStateWrapper>
			</Box>
			<CategoryBottomSheet
				visible={categoryBottomSheet}
				onDismiss={() => setCategoryBottomSheet(false)}
				onSubmit={newHandler}
				onUpdate={setCategory}
				category={category}
			/>
		</>
	);
}
