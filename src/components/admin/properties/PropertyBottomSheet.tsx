import { View } from 'react-native';
import {
	Button,
	ButtonText,
	Heading,
	Icon,
	Pressable,
	Text,
} from '@/components/ui';
import withRenderVisible from '@/components/shared/withRenderOpen';
import { composeFullAddress, formatMoney, fullName } from '@/lib/utils';
import { capitalize, chunk } from 'lodash-es';
import BottomSheet from '@/components/shared/BottomSheet';
import { PropertyStatus } from '@/components/property/PropertyStatus';
import { useState } from 'react';
import { PropertyModalMediaViewer } from '@/components/property/PropertyModalMediaViewer';
import { useLayout } from '@react-native-community/hooks';
import { PropertyMedia } from '@/components/property/PropertyMedia';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { format } from 'date-fns';
import { usePropertyStatusMutations } from '@/tanstack/mutations/usePropertyStatusMutations';
import PropertyActionsBottomSheet from './PropertyActionsBottomSheet';
import { Edit, MoreHorizontal } from 'lucide-react-native';

type PropertyBottomSheetProps = {
	visible: boolean;
	property: Property;
	user: Me;
	onDismiss: () => void;
};

function PropertyBottomSheet(props: PropertyBottomSheetProps) {
	const { visible, property, onDismiss, user } = props;
	const [isViewer, setIsViewer] = useState(false);
	const [imageIndex, setImagesIndex] = useState(0);
	const [openEdit, setOpenEdit] = useState(false);
	const { mutateAsync: approve } = usePropertyStatusMutations().approveMutation;
	const { mutateAsync: reject } = usePropertyStatusMutations().rejectMutation;
	const { mutateAsync: permanentDelete } =
		usePropertyStatusMutations().deleteMutation;
	const { mutateAsync: expire } = usePropertyStatusMutations().expireMutation;
	const { mutateAsync: flag } = usePropertyStatusMutations().flagMutation;
	const { mutateAsync: pending } = usePropertyStatusMutations().pendingMutation;
	const { mutateAsync: sell } = usePropertyStatusMutations().sellMutation;
	const { mutateAsync: softDelete } =
		usePropertyStatusMutations().softDeleteMutation;
	const { width, onLayout } = useLayout();

	const actions: ConfirmationActionConfig[] = [
		{
			visible: user?.role === 'admin' && property.status === 'pending',
			header: 'Property Status Update',
			actionText: 'Approve',
			description: 'This will approve the property. Proceed?',
			onConfirm: approve,
		},
		{
			visible: user?.role === 'admin' && property.status === 'pending',
			header: 'Property Status Update',
			actionText: 'Reject',
			description: 'This will reject the property. A valid reason is required.',
			requireReason: true,
			onConfirm: reject,
		},
		{
			visible: user?.role === 'admin' && property.status === 'approved',
			header: 'Property Status Update',
			actionText: 'Flag',
			description:
				'This will flag the property. Please provide a valid reason.',
			requireReason: true,
			onConfirm: flag,
		},
		{
			visible: user?.role === 'admin' && property.status === 'approved',
			header: 'Property Status Update',
			actionText: 'Expire',
			description:
				'This will expire the property. Provide a reason to proceed.',
			requireReason: true,
			onConfirm: expire,
		},
		{
			visible:
				user?.role === 'admin' &&
				property.status !== 'sold' &&
				property.status !== 'pending',
			header: 'Property Status Update',
			actionText: 'Set Pending',
			description: 'This will mark the property as pending again.',
			onConfirm: pending,
		},
		{
			visible: user?.id === property.owner.id && property.status === 'approved',
			header: 'Mark As Sold',
			actionText: 'Mark Sold',
			description: 'Are you sure you want to mark this property as sold?',
			onConfirm: sell,
		},
		{
			visible: user?.id === property.owner.id && property.status !== 'pending',
			header: 'Delete Property',
			actionText: 'Delete Property',
			description: 'This will temporarily remove the property. Are you sure?',
			onConfirm: softDelete,
			className: 'bg-primary',
		},
		{
			visible: property.status == 'approved' && user.role == 'admin',
			header: 'Permanent Delete',
			actionText: 'Delete',
			description:
				'This action is irreversible. Are you sure you want to permanently delete this property?',
			onConfirm: permanentDelete,
			className: 'bg-primary',
		},
	];
	const HeaderRightComponent = (
		<Pressable
			onPress={() => {
				setOpenEdit(true);
			}}
			className=" self-end ">
			<Icon size="xl" as={MoreHorizontal} className=" text-primary" />
		</Pressable>
	);
	return (
		<BottomSheet
			title="Review Property"
			onDismiss={onDismiss}
			visible={visible}
			withHeader
			HeaderRightComponent={HeaderRightComponent}
			withScroll={true}
			snapPoint={[450, 720]}>
			<View onLayout={onLayout} className="gap-y-4 flex-1 mt-4 px-4 pb-32">
				<View className=" rounded-2xl bg-background-muted p-4">
					<View className="flex-row justify-between">
						<Heading size="md" className="mb-3">
							Property Info
						</Heading>
						<Button>
							<ButtonText>Edit</ButtonText>
							<Icon size="sm" as={Edit} />
						</Button>
					</View>

					<View className="gap-y-3">
						<InfoRow label="Title" value={property.title} />
						<InfoRow
							label="Price"
							value={formatMoney(property.price, property.currency, 0)}
						/>
						<InfoRow label="Purpose" value={capitalize(property.purpose)} />
						<View className="flex-row justify-between py-1">
							<Text className="text-sm">Status:</Text>
							<PropertyStatus status={property.status} />
						</View>
						<InfoRow label="Category" value={capitalize(property.category)} />
						<InfoRow
							label="Subcategory"
							value={capitalize(property.subcategory)}
						/>
						<InfoRow
							label="Address"
							value={composeFullAddress(property.address, true)}
						/>
						<InfoRow
							label="Created"
							value={format(
								new Date(property?.created_at ?? new Date()),
								'dd MMM yyyy'
							)}
						/>
					</View>
				</View>
				<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
					<Heading size="md" className="mb-3">
						Description
					</Heading>
					<View className=" min-h-20">
						<Text numberOfLines={5}>{property?.description || 'N/A'}</Text>
					</View>
				</View>
				<View className="bg-background-muted min-h-32 rounded-2xl p-4 shadow-sm">
					<Heading size="md" className="mb-3">
						Media
					</Heading>
					<View className="flex-wrap gap-4">
						{chunk(property?.media_urls, 4).map((row, i) => (
							<View className={'flex-row gap-4'} key={i}>
								{row.map((media, i) => (
									<Pressable key={media}>
										<PropertyMedia
											style={{
												width: width > 100 ? (width - 100) / 4 : 72,
												height: width > 100 ? (width - 100) / 4 : 72,
											}}
											rounded
											className={' bg-background-muted'}
											source={media}
											canPlayVideo={false}
											onPress={() => {
												setImagesIndex(i);
												setIsViewer(true);
											}}
										/>
									</Pressable>
								))}
							</View>
						))}
					</View>
				</View>
				<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
					<Heading size="md" className="mb-3">
						Owner
					</Heading>
					<View className="gap-y-3">
						<InfoRow label="Name" value={fullName(property.owner)} />
						<InfoRow label="Email" value={property.owner?.email ?? 'N/A'} />
					</View>
				</View>
				{property.amenities.length > 0 && (
					<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
						<Heading size="md" className="mb-3">
							Amenities
						</Heading>
						<Text className="text-sm">
							{property.amenities.map((a) => a.name).join(', ')}
						</Text>
					</View>
				)}
			</View>

			<PropertyModalMediaViewer
				width={width}
				selectedIndex={imageIndex}
				visible={isViewer}
				setVisible={setIsViewer}
				canPlayVideo
				media={property?.media_urls}
			/>
			<PropertyActionsBottomSheet
				isOpen={openEdit}
				onDismiss={() => setOpenEdit(false)}
				withBackground={false}
				options={actions.filter((action) => action.visible)}
				OptionComponent={({ index, option, onPress }) => (
					<ConfirmationModal
						key={index}
						visible={option.visible}
						index={index}
						header={option.header}
						description={option.description}
						actionText={option.actionText}
						requireReason={option.requireReason}
						onConfirm={option.onConfirm}
						propertyId={property.id}
						className={option.className}
						onDismiss={onDismiss}
						onPress={onPress}
					/>
				)}
			/>
		</BottomSheet>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<View className="flex-row justify-between py-2">
			<Text className="text-sm">{label}:</Text>
			<Text className="text-sm text-right max-w-[60%]">{value}</Text>
		</View>
	);
}

export default withRenderVisible(PropertyBottomSheet);
