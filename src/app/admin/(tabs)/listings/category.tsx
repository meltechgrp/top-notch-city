import CategoryBottomSheet from '@/components/admin/properties/CategoryBottomSheet';
import CategoryItem from '@/components/admin/properties/CategoryItem';
import SubCategoryItem from '@/components/admin/properties/SubCategoryItem';
import AdminCreateButton from '@/components/admin/shared/AdminCreateButton';
import BeachPersonWaterParasolIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, Heading, View } from '@/components/ui';
import { useCategoryMutations } from '@/tanstack/mutations/useCategoryMutations';
import { useCategoryQueries } from '@/tanstack/queries/useCategoryQueries';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';

export default function Categories() {
	const [refreshing, setRefreshing] = useState(false);
	const { subcategoriesData, refetch, loading } = useCategoryQueries();
	const { addCategoryMutation } = useCategoryMutations();
	const { mutateAsync, isPending, isSuccess } = addCategoryMutation;
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	const data = useMemo(() => {
		if (!subcategoriesData) return [];

		return subcategoriesData.flatMap(({ category, data }) => [
			{ type: 'category', id: category.id, name: category.name },
			...data.map((sub) => ({
				type: 'subcategory',
				id: sub.id,
				name: sub.name,
				categoryId: category.id,
			})),
		]) as FlatItem[];
	}, [subcategoriesData]);
	async function newHandler(val: string) {
		await mutateAsync({ name: val });
		refetch();
	}

	async function onRefresh() {
		try {
			setRefreshing(true);
			refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}

	useEffect(() => {
		if (isSuccess) {
			setCategoryBottomSheet(false);
		}
	}, [isSuccess]);
	return (
		<Box className="flex-1">
			<View className="py-px flex-1">
				<EmptyStateWrapper
					isEmpty={!data.length}
					loading={loading}
					illustration={<BeachPersonWaterParasolIcon />}
					cta={
						<View className=" gap-2 items-center px-12">
							<Heading size="xl" className=" font-heading">
								No category yet
							</Heading>
						</View>
					}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					contentWrapperClassName="relative -top-24">
					<FlashList
						data={data}
						keyExtractor={(item) => `${item.type}-${item.id}`}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						renderItem={({ item }) => {
							if (item.type === 'category') {
								return (
									<CategoryItem
										className="mt-8 rounded-t-xl"
										item={{ id: item.id, name: item.name }}
									/>
								);
							}
							if (item.type === 'subcategory') {
								return (
									<SubCategoryItem
										categoryId={item.categoryId}
										item={{ id: item.id, name: item.name }}
									/>
								);
							}
							return null;
						}}
						estimatedItemSize={80}
						contentContainerStyle={{
							paddingBottom: 100,
							paddingHorizontal: 16,
						}}
						showsVerticalScrollIndicator={false}
					/>
				</EmptyStateWrapper>
			</View>
			<AdminCreateButton
				solo={true}
				onPress={() => setCategoryBottomSheet(true)}
			/>
			{categoryBottomSheet && (
				<CategoryBottomSheet
					visible={categoryBottomSheet}
					onDismiss={() => setCategoryBottomSheet(false)}
					onSubmit={newHandler}
					loading={isPending}
					type={'add'}
					value={undefined}
				/>
			)}
		</Box>
	);
}
