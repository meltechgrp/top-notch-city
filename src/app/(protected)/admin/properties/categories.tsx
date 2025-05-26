import { getCategories, newCategory } from '@/actions/property';
import CategoryBottomSheet from '@/components/admin/properties/CategoryBottomSheet';
import CategoryItem from '@/components/admin/properties/CategoryItem';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, View, Button, Icon, Heading } from '@/components/ui';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, RefreshControl } from 'react-native';

export default function Categories() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [category, setCategory] = useState('');
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);

	const getCats = useCallback(async () => {
		setLoading(true);
		const res = await getCategories();
		setCategories(res);
		setLoading(false);
	}, []);

	useEffect(() => {
		getCats();
	}, []);

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
		try {
			setLoading(true);
			await newCategory(category);
		} catch {
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<View>
							<Button
								onPress={() => {
									setCategory('');
									setCategoryBottomSheet(true);
								}}
								variant="link"
								className="px-4 bg-transparent">
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
						ItemSeparatorComponent={() => <View className="h-4" />}
						renderItem={({ item }) => (
							<CategoryItem onRefresh={onRefresh} item={item} />
						)}
					/>
				</EmptyStateWrapper>
			</Box>
			<CategoryBottomSheet
				visible={categoryBottomSheet}
				onDismiss={() => setCategoryBottomSheet(false)}
				onSubmit={newHandler}
				onUpdate={setCategory}
				loading={loading}
				category={category}
			/>
		</>
	);
}
