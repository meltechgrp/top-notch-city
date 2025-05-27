import { Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { useState } from 'react';
import { deleteSubCategory, editSubCategory } from '@/actions/property';
import CategoryBottomSheet from './CategoryBottomSheet';

type Props = {
	item: Category;
	catId: string;
	onRefresh: () => void;
};

export default function SubCategoryItem({ item, onRefresh, catId }: Props) {
	const [category, setCategory] = useState(item.name);
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	async function editHandler() {
		try {
			await editSubCategory(catId, category, item.id);
		} catch {
		} finally {
			setCategoryBottomSheet(false);
			onRefresh();
		}
	}
	async function deleteHandler() {
		try {
			await deleteSubCategory(catId, item);
		} catch {
		} finally {
			onRefresh();
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
				onUpdate={setCategory}
				category={category}
			/>
		</>
	);
}
