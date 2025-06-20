import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText } from '../ui';
import { showSnackbar } from '@/lib/utils';
import { SpinningLoader } from '../loaders/SpinningLoader';
import { useState, useMemo } from 'react';
import { z } from 'zod';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';
import { useCategoryQueries } from '@/tanstack/queries/useCategoryQueries';
import { CustomInput } from '../shared/CustomInput';
import CustomSelect from '../shared/CustomSelect';
import { usePropertyDataMutations } from '@/tanstack/mutations/usePropertyDataMutations';

const PropertyBasicEditSchema = z.object({
	title: z.string().min(1),
	price: z.string().min(1),
	currency: z.string().min(1),
	purpose: z.string().min(1),
	category: z.string().min(1),
	subcategory: z.string().min(1),
});

type Props = {
	visible: boolean;
	onDismiss: () => void;
	property: Property;
};

function PropertyBasicEditBottomSheet(props: Props) {
	const { visible, onDismiss, property } = props;
	const { updatePropertyMutation } = usePropertyDataMutations();
	const { categories, subcategoriesData, loading } = useCategoryQueries();

	const [form, setForm] = useState({
		title: property?.title || '',
		price: property?.price?.toString() || '',
		currency: property?.currency || 'ngn',
		purpose: property?.purpose || '',
		category: property?.category || '',
		subcategory: property?.subcategory || '',
	});

	const availableSubcategories = useMemo(() => {
		return (
			subcategoriesData?.find((s) => s.category.name === form.category)?.data ||
			[]
		);
	}, [form.category, subcategoriesData]);

	async function handleUpload() {
		await updatePropertyMutation.mutateAsync(
			{
				propertyId: property.id,
				data: form,
			},
			{
				onSuccess: () => {
					showSnackbar({
						message: 'Property updated successfully',
						type: 'success',
					});
					onDismiss();
				},
				onError: () => {
					showSnackbar({ message: 'Failed to update property', type: 'error' });
				},
			}
		);
	}

	function onUpdate(val: string, type: keyof typeof form) {
		setForm((prev) => ({ ...prev, [type]: val }));
	}
	function handleDismiss() {
		setForm({
			title: property?.title || '',
			price: property?.price?.toString() || '',
			currency: property?.currency || 'ngn',
			purpose: property?.purpose || '',
			category: property?.category || '',
			subcategory: property?.subcategory || '',
		});
		onDismiss();
	}
	return (
		<BottomSheet
			title="Edit Basic Details"
			withHeader={true}
			snapPoint={'85%'}
			withScroll
			visible={visible}
			onDismiss={handleDismiss}>
			<View className="flex-1 gap-4 p-4 pb-8 bg-background">
				<View className="gap-4">
					<CustomInput
						title="Title"
						placeholder="1 bedroom flat..."
						value={form.title}
						onUpdate={(val) => onUpdate(val, 'title')}
					/>
					<CustomInput
						title="Price"
						keyboardType="numeric"
						placeholder="Enter price"
						value={form.price}
						onUpdate={(val) => onUpdate(val, 'price')}
					/>
					<CustomSelect
						withDropIcon
						label="Currency"
						BottomSheet={OptionsBottomSheet}
						value={form.currency}
						valueParser={(value: any) => value || 'Select Currency'}
						onChange={(val) => onUpdate(val?.value, 'currency')}
						options={[
							{ label: 'NGN', value: 'ngn' },
							{ label: 'USD', value: 'usd' },
						]}
					/>
					<CustomSelect
						withDropIcon
						label="Purpose"
						BottomSheet={OptionsBottomSheet}
						value={form.purpose}
						valueParser={(value: any) => value || 'Select Purpose'}
						onChange={(val) => onUpdate(val?.value, 'purpose')}
						options={[
							{ label: 'Sell', value: 'Sell' },
							{ label: 'Rent', value: 'Rent' },
						]}
					/>
					<CustomSelect
						withDropIcon
						label="Category"
						BottomSheet={OptionsBottomSheet}
						value={form.category}
						valueParser={(val: any) =>
							categories.find((c) => c.name === val)?.name || 'Select Category'
						}
						onChange={(val) => onUpdate(val?.value, 'category')}
						options={categories.map((c) => ({ label: c.name, value: c.name }))}
					/>
					<CustomSelect
						withDropIcon
						label="Subcategory"
						BottomSheet={OptionsBottomSheet}
						value={form.subcategory}
						valueParser={(val: any) =>
							availableSubcategories.find((s) => s.name === val)?.name ||
							'Select Subcategory'
						}
						onChange={(val) => onUpdate(val?.value, 'subcategory')}
						options={availableSubcategories.map((s) => ({
							label: s.name,
							value: s.name,
						}))}
					/>
				</View>
				<View className="flex-row gap-4 mt-4">
					<Button
						className="h-11 flex-1"
						onPress={async () => {
							const validate = PropertyBasicEditSchema.safeParse(form);
							if (!validate.success) {
								return showSnackbar({
									message: 'Please enter valid details.',
									type: 'warning',
								});
							}
							await handleUpload();
						}}>
						{updatePropertyMutation.isPending && <SpinningLoader />}
						<ButtonText className="text-white">Update</ButtonText>
					</Button>
				</View>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(PropertyBasicEditBottomSheet);
