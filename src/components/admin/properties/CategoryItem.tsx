import { Icon, Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import CategoryBottomSheet from './CategoryBottomSheet';
import { useRouter } from 'expo-router';
import { useApiRequest } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';

type Props = {
	item: Category;
	refetch: () => Promise<Category[]>;
};

export default function CategoryItem({ item, refetch }: Props) {
	const router = useRouter();
	const { request, loading, error } = useApiRequest();
	const [category, setCategory] = useState(item.name);
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	async function editHandler() {
		await request({
			url: `/categories/${item.id}`,
			method: 'PUT',
			data: { name: category },
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
			url: `/categories/${item.id}`,
			method: 'DELETE',
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
						<Text size="lg" className="capitalize">
							{item.name}
						</Text>
						<Text className="  font-light">Category</Text>
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
				type="edit"
				category={category}
			/>
		</>
	);
}
