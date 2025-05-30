import { Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { useState } from 'react';
import CategoryBottomSheet from './CategoryBottomSheet';
import { useApiRequest } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';

type Props = {
	item: Category;
	catId: string;
	refetch: () => Promise<Category[]>;
};

export default function SubCategoryItem({ item, refetch, catId }: Props) {
	const [category, setCategory] = useState(item.name);
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	const { request, loading, error } = useApiRequest();
	async function editHandler() {
		await request({
			url: `/categories/subcategories/${item.id}`,
			method: 'PUT',
			data: { name: category, category_id: catId },
		});
		if (!error) {
			setCategoryBottomSheet(false);
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
			data: { category_id: catId },
		});
		if (!error) {
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
			<SwipeableWrapper
				rightAction={() => setCategoryBottomSheet(true)}
				leftAction={() => deleteHandler()}>
				<View className="flex-1 p-6 py-4 flex-row justify-between items-center bg-background-muted">
					<View>
						<Text size="lg" className=" capitalize">
							{item.name}
						</Text>
						<Text className=" capitalize font-light">Sub category</Text>
					</View>
				</View>
			</SwipeableWrapper>
			<CategoryBottomSheet
				visible={categoryBottomSheet}
				onDismiss={() => setCategoryBottomSheet(false)}
				onSubmit={editHandler}
				loading={loading}
				type="edit"
				onUpdate={setCategory}
				category={category}
			/>
		</>
	);
}
