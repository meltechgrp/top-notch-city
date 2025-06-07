import { Icon, Pressable, Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import CategoryBottomSheet from './CategoryBottomSheet';
import { useApiRequest } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';

type Props = {
	item: Omit<Category, 'slug'>;
	refetch: () => Promise<void>;
};

export default function CategoryItem({ item, refetch }: Props) {
	const { request, loading, error } = useApiRequest();
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	const [type, setType] = useState<'edit' | 'add' | undefined>();
	async function editHandler(val: string) {
		try {
			await request({
				url: `/categories/${item.id}`,
				method: 'PUT',
				data: { name: val },
			});
			if (!error) {
				setType(undefined);
				setCategoryBottomSheet(false);
				showSnackbar({
					message: 'Category updated successfully.',
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
	async function deleteHandler() {
		try {
			await request({
				url: `/categories/${item.id}`,
				method: 'DELETE',
			});
			if (!error) {
				setType(undefined);
				setCategoryBottomSheet(false);
				showSnackbar({
					message: 'Category deleted successfully.',
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

	async function newSubHandler(val: string) {
		try {
			const data = await request({
				url: `/categories/${item.id}/subcategories`,
				method: 'POST',
				data: { name: val, category_id: item.id },
			});
			console.log(data);
			if (data) {
				setType(undefined);
				setCategoryBottomSheet(false);
				showSnackbar({
					message: 'Sub category created successfully.',
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
		<>
			<SwipeableWrapper
				rightAction={() => {
					setType('edit');
					setCategoryBottomSheet(true);
				}}
				leftAction={() => deleteHandler()}>
				<View className="flex-1 p-6 py-4 flex-row justify-between items-center bg-background-info">
					<View>
						<Text size="lg" className="capitalize">
							{item.name} Category
						</Text>
					</View>
					<View>
						<Pressable
							onPress={() => {
								setType('add');
								setCategoryBottomSheet(true);
							}}
							className=" p-2 rounded-full bg-background">
							<Icon size="xl" as={Plus} className="text-primary" />
						</Pressable>
					</View>
				</View>
			</SwipeableWrapper>
			{type && (
				<CategoryBottomSheet
					visible={categoryBottomSheet}
					onDismiss={() => {
						setType(undefined);
						setCategoryBottomSheet(false);
					}}
					onSubmit={async (val) => {
						if (type == 'add') {
							await newSubHandler(val);
						} else {
							await editHandler(val);
						}
					}}
					loading={loading}
					type={type}
					value={type == 'edit' ? item.name : undefined}
				/>
			)}
		</>
	);
}
