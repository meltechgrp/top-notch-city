import { Icon, Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { deleteCategory, editCategory } from '@/actions/property';
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
			await editCategory(item);
		} catch {
		} finally {
			setCategoryBottomSheet(false);
			onRefresh();
			setLoading(false);
		}
	}
	async function deleteHandler() {
		// try {
		// 	setLoading(true);
		// 	await deleteCategory(item);
		// } catch {
		// } finally {
		// 	setCategoryBottomSheet(false);
		// 	onRefresh();
		// 	setLoading(false);
		// }
	}
	return (
		<>
			<SwipeableWrapper
				rightAction={() => setCategoryBottomSheet(true)}
				leftAction={() => deleteHandler()}>
				<View className="flex-1 p-6 py-5 flex-row justify-between items-center bg-background-muted">
					<View>
						<Text size="md">{item.name}</Text>
						<Text className=" capitalize font-light">Category</Text>
					</View>
					<View>
						<Pressable
							onPress={() =>
								router.push({
									pathname: '/admin/properties/sub-categories',
									params: {
										catId: item.id,
										catName: item.name,
									},
								})
							}>
							<View className="flex-row gap-2">
								<Text>Sub</Text>
								<Icon as={ChevronRight} className="text-primary" />
							</View>
							<Text>Categories</Text>
						</Pressable>
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
