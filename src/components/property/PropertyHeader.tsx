import { Icon, Pressable, View } from '@/components/ui';
import { PropertyLikeButton } from './PropertyLikeButton';
import { PropertyWishListButton } from './PropertyWishListButton';
import { PropertyShareButton } from './PropertyShareButton';
import PropertyActionsBottomSheet from '../modals/property/PropertyActionsBottomSheet';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useState } from 'react';
import { usePropertyStatusMutations } from '@/tanstack/mutations/usePropertyStatusMutations';
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

interface Props {
	property: Property;
	isAdmin?: boolean;
	isOwner?: boolean;
}

export default function PropertyHeader({
	property,
	isAdmin = false,
	isOwner = false,
}: Props) {
	const [isActions, setIsActions] = useState(false);
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
	const actions: ConfirmationActionConfig[] = [
		{
			visible: isAdmin && property.status === 'pending',
			header: 'Property Status Update',
			actionText: 'Approve',
			description: 'This will approve the property. Proceed?',
			onConfirm: approve,
		},
		{
			visible: isAdmin && property.status === 'pending',
			header: 'Property Status Update',
			actionText: 'Reject',
			description: 'This will reject the property. A valid reason is required.',
			requireReason: true,
			onConfirm: reject,
		},
		{
			visible: isAdmin && property.status === 'approved',
			header: 'Property Status Update',
			actionText: 'Flag',
			description:
				'This will flag the property. Please provide a valid reason.',
			requireReason: true,
			onConfirm: flag,
		},
		{
			visible: isAdmin && property.status === 'approved',
			header: 'Property Status Update',
			actionText: 'Expire',
			description:
				'This will expire the property. Provide a reason to proceed.',
			requireReason: true,
			onConfirm: expire,
		},
		{
			visible:
				isAdmin && property.status !== 'sold' && property.status !== 'pending',
			header: 'Property Status Update',
			actionText: 'Set Pending',
			description: 'This will mark the property as pending again.',
			onConfirm: pending,
		},
		{
			visible: isOwner && property.status === 'approved',
			header: 'Mark As Sold',
			actionText: 'Mark Sold',
			description: 'Are you sure you want to mark this property as sold?',
			onConfirm: sell,
		},
		{
			visible: !isAdmin && isOwner && property.status !== 'pending',
			header: 'Delete Property',
			actionText: 'Delete Property',
			description: 'This will delete your property. Are you sure?',
			onConfirm: softDelete,
			className: 'text-primary',
			iconClassName: 'text-primary',
		},
		{
			visible: property.status == 'approved' && isAdmin,
			header: 'Permanent Delete',
			actionText: 'Delete',
			description:
				'This action is irreversible. Are you sure you want to permanently delete this property?',
			onConfirm: permanentDelete,
			className: 'text-primary',
			iconClassName: 'text-primary',
		},
	];
	const ActionButton = () => (
		<Pressable
			both
			onPress={() => {
				setIsActions(true);
			}}
			className="">
			<Entypo name="dots-three-horizontal" size={28} color={Colors.primary} />
		</Pressable>
	);
	return (
		<>
			{isAdmin && (
				<View className="pr-4 flex-row items-center gap-4">
					<PropertyShareButton property={property} />
					<PropertyLikeButton property={property} />
					<ActionButton />
				</View>
			)}
			{!isAdmin && isOwner && (
				<View className="pr-4 flex-row items-center gap-4">
					<PropertyShareButton property={property} />
					<ActionButton />
				</View>
			)}
			{!isAdmin && !isOwner && (
				<View className="pr-4 flex-row items-center gap-4">
					<PropertyShareButton property={property} />
					<PropertyLikeButton property={property} />
					<PropertyWishListButton property={property} />
				</View>
			)}
			<PropertyActionsBottomSheet
				isOpen={isActions}
				onDismiss={() => setIsActions(false)}
				withBackground={false}
				isOnwer={isOwner}
				propertyId={property.id}
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
						iconClassName={option.iconClassName}
						propertyId={property.id}
						className={option.className}
						onDismiss={() => setIsActions(false)}
						onPress={onPress}
					/>
				)}
			/>
		</>
	);
}
