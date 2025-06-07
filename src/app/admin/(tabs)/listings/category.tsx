import { useCategorySections } from '@/actions/property';
import CategoryBottomSheet from '@/components/admin/properties/CategoryBottomSheet';
import CategoryItem from '@/components/admin/properties/CategoryItem';
import SubCategoryItem from '@/components/admin/properties/SubCategoryItem';
import AdminCreateButton from '@/components/admin/shared/AdminCreateButton';
import BeachPersonWaterParasolIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, Heading, View } from '@/components/ui';
import { useApiRequest } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { RefreshControl, SectionList } from 'react-native';

export default function Categories() {
	const { request, loading: loader, error } = useApiRequest();
	const [refetching, setRefetching] = useState(false);
	const { loading, sections, refetch } = useCategorySections();
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);

	async function onRefresh() {
		try {
			setRefetching(true);
			const data = await refetch();
			console.log(data);
		} catch (error) {
		} finally {
			setRefetching(false);
		}
	}

	async function newHandler(val: string) {
		try {
			const data = await request({
				url: '/categories',
				method: 'POST',
				data: { name: val },
			});
			if (data) {
				setCategoryBottomSheet(false);
				showSnackbar({
					message: 'Category created successfully.',
					type: 'success',
				});
				await refetch();
			} else {
				showSnackbar({
					message: 'Something went wrong!, Try again..',
					type: 'error',
				});
			}
		} catch (error) {
			console.log(error);
			showSnackbar({
				message: 'Something went wrong!, Try again..',
				type: 'error',
			});
		}
	}
	return (
		<Box className="flex-1">
			<View className="py-6 flex-1">
				<EmptyStateWrapper
					isEmpty={!sections.length}
					illustration={<BeachPersonWaterParasolIcon />}
					cta={
						<View className=" gap-2 items-center px-12">
							<Heading size="xl" className=" font-heading">
								No category yet
							</Heading>
						</View>
					}
					refreshControl={
						<RefreshControl refreshing={refetching} onRefresh={onRefresh} />
					}
					contentWrapperClassName="relative -top-24">
					<SectionList
						refreshControl={
							<RefreshControl refreshing={refetching} onRefresh={onRefresh} />
						}
						contentContainerClassName=" px-4 overflow-hidden pb-28 rounded-xl"
						showsVerticalScrollIndicator={false}
						renderSectionHeader={({ section: { name, id } }) => (
							<CategoryItem refetch={onRefresh} item={{ name, id }} />
						)}
						renderSectionFooter={() => <View className="h-8 bg-background" />}
						sections={sections}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<SubCategoryItem refetch={onRefresh} item={item} />
						)}
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
					loading={loading}
					type={'add'}
					value={undefined}
				/>
			)}
		</Box>
	);
}
