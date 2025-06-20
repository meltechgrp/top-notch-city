import React, { useState, useEffect, ReactNode } from 'react';
import { Modal, View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, ButtonText, Pressable, Icon } from '../ui';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react-native';

type ConfirmationModalProps = ConfirmationActionConfig &
	TouchableWithoutFeedback['props'] & {
		onDismiss?: () => void;
		onDelete?: () => void;
		confirmText?: string;
		cancelText?: string;
		index?: number;
		propertyId?: string;
		optionalComponent?: ReactNode;
	};

export function ConfirmationModal({
	onConfirm,
	header,
	description,
	requireReason = false,
	confirmText = 'Continue',
	cancelText = 'Cancel',
	className,
	actionText,
	iconClassName,
	propertyId,
	onDismiss,
	onPress,
	index,
	onDelete,
	optionalComponent,
}: ConfirmationModalProps) {
	const [confirmationModal, setConfirmationModal] = useState(false);
	const [reason, setReason] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!confirmationModal) {
			setReason('');
			setError('');
			setLoading(false);
			setConfirmationModal(false);
		}
	}, [confirmationModal]);

	const handleConfirm = async (e: any) => {
		if (requireReason && reason.trim().length < 3) {
			setError('Please provide a valid reason (min 3 characters).');
			return;
		}

		setError('');
		setLoading(true);
		try {
			if (!propertyId) {
				onDelete?.();
			} else {
				await onConfirm({ propertyId, reason });
			}
			onDismiss?.();
			onPress && onPress(e);
			setConfirmationModal(false);
		} catch (err) {
			console.error('Confirmation error:', err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			{!optionalComponent ? (
				<Pressable
					onPress={(e) => {
						setConfirmationModal(true);
					}}
					className={cn(
						'px-4 h-14 flex-row justify-between rounded-xl items-center',
						!!index && 'border-outline border-t',
						className
					)}>
					<Text className={cn('text-lg flex-1', className)}>{actionText}</Text>
					<Icon as={ChevronRight} className={iconClassName} />
				</Pressable>
			) : (
				<Pressable
					onPress={() => {
						setConfirmationModal(true);
					}}
					className={className}>
					{optionalComponent}
				</Pressable>
			)}
			<Modal
				visible={confirmationModal}
				backdropColor="rgba(0,0,0,0.6)"
				animationType="fade"
				onRequestClose={() => setConfirmationModal(false)}>
				<View className="flex-1 justify-center items-center bg-black/50 px-4">
					<View className="w-[90%] max-w-md bg-background p-6 rounded-2xl gap-1">
						<Text className="text-xl font-semibold text-center">{header}</Text>
						{description && (
							<Text className="text-center text-typography/80 text-sm">
								{description}
							</Text>
						)}

						{requireReason && (
							<View className=" mt-3">
								<TextInput
									value={reason}
									onChangeText={setReason}
									placeholder="Enter your reason..."
									className={cn(
										'border rounded-xl px-4 min-h-12 py-2 mt-2 text-sm text-typography bg-background-muted',
										error && 'border-primary'
									)}
									multiline
								/>
								{error && (
									<Text className="text-xs text-primary mt-1">{error}</Text>
								)}
							</View>
						)}

						<View className="flex-row justify-center gap-3 mt-6">
							<Button
								variant="outline"
								onPress={() => setConfirmationModal(false)}
								disabled={loading}>
								<ButtonText>{cancelText}</ButtonText>
							</Button>
							<Button onPress={handleConfirm} disabled={loading}>
								<ButtonText>
									{loading ? 'Processing...' : confirmText}
								</ButtonText>
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}
