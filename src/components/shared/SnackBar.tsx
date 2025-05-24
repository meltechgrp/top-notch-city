import { cn } from '@/lib/utils';
import {
	CircleAlert,
	MailOpen,
	ShieldAlert,
	ThumbsUp,
} from 'lucide-react-native';

import { AnimatePresence, View } from 'moti';
import * as React from 'react';
import { Modal, Pressable } from 'react-native';
import { Heading, Text, Icon as IconWrapper } from '../ui';

type Props = {
	onClose: () => void;
	duration?: number;
	text: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	icon?: React.ReactNode;
	backdrop?: boolean;
};
export default function SnackBar(props: Props) {
	const [show, setShow] = React.useState(true);
	const [showModal, setShowModal] = React.useState(true);
	function handleClose() {
		setShow(false);
		setTimeout(() => {
			setShowModal(false);
		}, 200);
		setTimeout(() => {
			props.onClose();
		}, 300);
	}
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			handleClose();
		}, props.duration || 5000);
		return () => clearTimeout(timeout);
	}, []);
	const Icon = React.useMemo(() => {
		if (props.icon) return props.icon;
		switch (props.type) {
			case 'success':
				return <IconWrapper as={ThumbsUp} className=" text-green-500" />;
			case 'error':
				return <IconWrapper as={ShieldAlert} color="white" />;
			case 'warning':
				return <IconWrapper as={CircleAlert} color="white" />;
			case 'info':
				return <IconWrapper as={MailOpen} color="white" />;
			default:
				return null;
		}
	}, []);

	const withBackdrop = React.useCallback(
		(modalContent: React.ReactElement) => {
			if (props.backdrop === undefined || props.backdrop) {
				return (
					<View
						className="flex-1 bg-black/50 justify-end"
						onTouchEnd={handleClose}>
						{modalContent}
					</View>
				);
			} else if (props.backdrop === false) {
				return <>{modalContent}</>;
			}
		},
		[props.backdrop]
	);
	return (
		<Modal
			animationType="fade"
			visible={showModal}
			transparent
			onRequestClose={handleClose}
			className="m-0 z-50">
			{withBackdrop(
				<AnimatePresence exitBeforeEnter>
					{show && (
						<View
							from={{
								bottom: -64,
								opacity: 0,
							}}
							animate={{
								bottom: 32,
								opacity: 1,
							}}
							exit={{
								bottom: -64,
								opacity: 0,
							}}
							transition={{ duration: 300, type: 'timing' }}
							style={[{ minHeight: 64 }]}
							className=" absolute w-full bottom-8 px-4">
							<View
								className={cn(
									' flex-row justify-center bg-background-info items-center p-4  rounded-lg w-full h-full',
									props.backdrop === false &&
										'shadow-2xl border border-outline',
									props.type !== 'success' && 'bg-primary/80'
								)}>
								{!!Icon && (
									<View className="items-center justify-center h-full pr-2">
										{Icon}
									</View>
								)}
								<View className="flex-1 justify-center h-full">
									<Text className={cn('text-sm')}>{props.text}</Text>
								</View>
								<Pressable
									onPress={handleClose}
									className="items-center justify-center h-full pl-2">
									<Heading className="text-sm  ">Dismiss</Heading>
								</Pressable>
							</View>
						</View>
					)}
				</AnimatePresence>
			)}
		</Modal>
	);
}
