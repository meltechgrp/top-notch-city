import { Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { useState } from 'react';
import { deleteSubCategory, editSubCategory } from '@/actions/property';
import CategoryBottomSheet from './CategoryBottomSheet';
import { useRouter } from 'expo-router';

type Props = {
	item: Category;
	onRefresh: () => void;
};

export default function CategoryItem({ item, onRefresh }: Props) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [category, setCategory] = useState(item.name);
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	async function editHandler() {
		try {
			setLoading(true);
			await editSubCategory(item);
		} catch {
		} finally {
			setCategoryBottomSheet(false);
			onRefresh();
			setLoading(false);
		}
	}
	async function deleteHandler() {
		try {
			setLoading(true);
			await deleteSubCategory(item);
		} catch {
		} finally {
			setCategoryBottomSheet(false);
			onRefresh();
			setLoading(false);
		}
	}
	return (
		<>
			<SwipeableWrapper
				rightAction={() => setCategoryBottomSheet(true)}
				leftAction={() => deleteHandler()}>
				<View className="flex-1 p-6 py-5 flex-row justify-between items-center bg-background-muted">
					<View>
						<Text size="md">{item.name}</Text>
						<Text className=" capitalize font-light">Sub category</Text>
					</View>
				</View>
			</SwipeableWrapper>
			<CategoryBottomSheet
				visible={categoryBottomSheet}
				onDismiss={() => setCategoryBottomSheet(false)}
				onSubmit={editHandler}
				onUpdate={setCategory}
				loading={loading}
				category={category}
			/>
		</>
	);
}
