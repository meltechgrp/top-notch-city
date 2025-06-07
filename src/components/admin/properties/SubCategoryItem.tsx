import { Icon, Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { useState } from 'react';
import CategoryBottomSheet from './CategoryBottomSheet';
import { useApiRequest } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react-native';

type Props = {
	item: CategorySections[0]['data'][0];
	refetch: () => Promise<void>;
};

export default function SubCategoryItem({ item, refetch }: Props) {
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	const { request, loading, error } = useApiRequest();

	async function editHandler(val: string) {
		await request({
			url: `/categories/subcategories/${item.id}`,
			method: 'PUT',
			data: { name: val, category_id: item.catId },
		});
		if (!error) {
			setCategoryBottomSheet(false);
			showSnackbar({
				message: 'Sub category updated successfully.',
				type: 'success',
			});
			await refetch();
		} else {
			showSnackbar({
				message: 'Something went wrong!, Try again..',
				type: 'error',
			});
		}
	}
	async function deleteHandler() {
		await request({
			url: `/categories/subcategories/${item.id}`,
			method: 'DELETE',
			data: { category_id: item.catId },
		});
		if (!error) {
			setCategoryBottomSheet(false);
			showSnackbar({
				message: 'Sub category deleted successfully.',
				type: 'success',
			});
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
			<SwipeableWrapper
				rightAction={() => setCategoryBottomSheet(true)}
				leftAction={() => deleteHandler()}>
				<View className="flex-1 p-6 py-5 border-t border-outline flex-row justify-between items-center bg-background-muted">
					<View className="flex-row gap-2 items-center">
						<Icon size="sm" as={CornerDownRight} className="text-primary" />
						<Text size="md" className=" capitalize font-light">
							{item.name}
						</Text>
					</View>
				</View>
			</SwipeableWrapper>
			<CategoryBottomSheet
				visible={categoryBottomSheet}
				onDismiss={() => setCategoryBottomSheet(false)}
				onSubmit={editHandler}
				loading={loading}
				type="edit"
				value={item.name}
			/>
		</>
	);
}
