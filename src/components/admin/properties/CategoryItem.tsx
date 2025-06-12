import { Icon, Pressable, Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import CategoryBottomSheet from './CategoryBottomSheet';
import { useCategoryMutations } from '@/tanstack/mutations/useCategoryMutations';
import { cn } from '@/lib/utils';
import { useCategoryQueries } from '@/tanstack/queries/useCategoryQueries';

type Props = {
	item: Omit<Category, 'slug'>;
	className?: string;
};

export default function CategoryItem({ item, className }: Props) {
	const {
		mutateAsync: editCategory,
		isPending: loading3,
		isSuccess,
	} = useCategoryMutations().editCategoryMutation;
	const {
		mutateAsync: deleteCategory,
		isPending: loading,
		isSuccess: isSuccess2,
	} = useCategoryMutations().deleteCategoryMutation;
	const {
		mutateAsync: addSubcategory,
		isPending: loading2,
		isSuccess: isSuccess3,
	} = useCategoryMutations().addSubcategoryMutation;
	const { refetch } = useCategoryQueries();
	const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
	const [type, setType] = useState<'edit' | 'add' | undefined>();
	async function editHandler(val: string) {
		await editCategory({
			id: item.id,
			data: { name: val },
		});
		refetch();
	}
	async function deleteHandler() {
		await deleteCategory({ id: item.id });
		refetch();
	}

	async function newSubHandler(val: string) {
		await addSubcategory({
			categoryId: item.id,
			data: { name: val, category_id: item.id },
		});
		refetch();
	}

	useEffect(() => {
		if (isSuccess || isSuccess2 || isSuccess3) {
			setCategoryBottomSheet(false);
		}
	}, [isSuccess, isSuccess2, isSuccess3]);
	return (
		<>
			<View className={cn('flex-1', className)}>
				<SwipeableWrapper
					rightAction={() => {
						setType('edit');
						setCategoryBottomSheet(true);
					}}
					leftAction={() => deleteHandler()}>
					<View
						className={cn(
							'flex-1 p-6 py-4 flex-row justify-between items-center bg-background-info rounded-t-xl'
						)}>
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
			</View>
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
					loading={loading || loading2 || loading3}
					type={type}
					value={type == 'edit' ? item.name : undefined}
				/>
			)}
		</>
	);
}
