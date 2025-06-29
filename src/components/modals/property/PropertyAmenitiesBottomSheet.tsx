import { TextInput, View } from 'react-native';
import {
	Heading,
	Icon,
	Pressable,
	Switch,
	Text,
	Button,
	ButtonText,
} from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { useCallback, useMemo, useState } from 'react';
import withRenderVisible from '@/components/shared/withRenderOpen';
import BottomSheet from '../../shared/BottomSheet';
import { usePropertyDataMutations } from '@/tanstack/mutations/usePropertyDataMutations';
import { showSnackbar } from '@/lib/utils';
import { LucideIcon, Minus, Plus } from 'lucide-react-native';
import { Amenities } from '@/constants/Amenities';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	property: Property;
};

function PropertyAmenitiesBottomSheet({ visible, onDismiss, property }: Props) {
	const prev = useMemo(
		() =>
			property.amenities?.map((a) => ({
				label: a.name,
				icon: a.icon,
				value: a.value,
			})),
		[property?.amenities]
	);
	const [facilities, setFacilities] = useState<
		{
			label: string;
			icon: string;
			value: any;
		}[]
	>(prev || []);
	const { updatePropertyAmenitiesMutation } = usePropertyDataMutations();

	const updateFacilities = useCallback(
		(label: string, iconName: string, value: any) => {
			const prev = facilities;
			const existing = prev.find((fac) => fac.label === label);
			let updated;

			if (value === false || value === 0 || value === '') {
				updated = prev.filter((fac) => fac.label !== label);
			} else if (!existing) {
				updated = [...prev, { label, icon: iconName, value }];
			} else {
				updated = prev.map((fac) =>
					fac.label === label ? { ...fac, value } : fac
				);
			}
			setFacilities(updated);
		},
		[facilities]
	);

	const getFacilityValue = useCallback(
		(label: string) => facilities.find((f) => f.label === label)?.value ?? 0,
		[facilities]
	);

	const MemoizedNumberInput = ({
		value,
		onCommitChange,
	}: {
		label: string;
		iconName: string;
		value: string;
		onCommitChange: (val: string) => void;
	}) => {
		const [inputValue, setInputValue] = useState(value);

		return (
			<View className="flex-row items-center w-40 h-12 border border-outline px-2.5 py-1 rounded-md">
				<TextInput
					value={inputValue}
					onChangeText={(val) => setInputValue(val)}
					onEndEditing={() => onCommitChange(inputValue)}
					className="flex-1 text-typography"
					keyboardType="number-pad"
					placeholder="e.g. 4500"
					returnKeyType="done"
				/>
			</View>
		);
	};

	const Layout = useCallback(
		({
			type,
			item,
		}: {
			type: string;
			item: { label: string; icon: LucideIcon; iconName: string };
		}) => {
			const value = getFacilityValue(item.label);
			switch (type) {
				case 'btn':
					return (
						<View className="flex-row items-center gap-3">
							<Pressable
								onPress={() =>
									updateFacilities(
										item.label,
										item.iconName,
										Math.max(0, value - 1)
									)
								}>
								<View className="p-3 border border-outline-100 rounded-full">
									<Icon as={Minus} />
								</View>
							</Pressable>
							<Text size="xl">{value}</Text>
							<Pressable
								onPress={() =>
									updateFacilities(item.label, item.iconName, Number(value) + 1)
								}>
								<View className="p-3 border border-outline-100 rounded-full">
									<Icon as={Plus} />
								</View>
							</Pressable>
						</View>
					);
				case 'num':
					return (
						<MemoizedNumberInput
							label={item.label}
							iconName={item.iconName}
							value={String(value || '')}
							onCommitChange={(val) =>
								updateFacilities(item.label, item.iconName, val)
							}
						/>
					);
				case 'bool':
					return (
						<Switch
							size="md"
							value={!!value}
							onToggle={() =>
								updateFacilities(item.label, item.iconName, !value)
							}
							trackColor={{ false: '#d4d5d4', true: Colors.primary }}
							thumbColor={'#ddd'}
							ios_backgroundColor={'#ddd'}
						/>
					);
				default:
					return null;
			}
		},
		[getFacilityValue, updateFacilities]
	);

	const handleSave = async () => {
		await updatePropertyAmenitiesMutation.mutateAsync(
			{
				propertyId: property.id,
				data: facilities,
			},
			{
				onSuccess: () => {
					showSnackbar({
						message: 'Amenities updated successfully',
						type: 'success',
					});
					onDismiss();
				},
				onError: () => {
					showSnackbar({
						message: 'Failed to update amenities',
						type: 'error',
					});
				},
			}
		);
	};

	return (
		<BottomSheet
			title="Update property amenities"
			withHeader={true}
			withBackButton={false}
			snapPoint="90%"
			visible={visible}
			withScroll
			onDismiss={onDismiss}>
			<View className="px-4 pb-8 pt-4">
				<Heading size="xl" className="mb-4">
					Share Details About Your Property
				</Heading>
				<View className="gap-8">
					{Amenities.map((section) => (
						<View key={section.title} className="gap-3">
							<Text size="xl" className="font-light">
								{section.title}
							</Text>
							<View className="gap-4">
								{section.data.map((item) => (
									<View
										key={item.label}
										className="gap-2 p-4 flex-row justify-between items-center rounded-2xl bg-background-muted">
										<View className="flex-row gap-4 items-center">
											<Icon as={item.icon} className="text-primary w-6 h-6" />
											<Text size="lg">{item.label}</Text>
										</View>
										<Layout type={section.type} item={item} />
									</View>
								))}
							</View>
						</View>
					))}
				</View>

				<Button className="mt-8 h-12" onPress={handleSave}>
					<ButtonText>Save</ButtonText>
				</Button>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(PropertyAmenitiesBottomSheet);
