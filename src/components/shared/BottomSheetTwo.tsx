import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import BottomSheet from './BottomSheet';
import { CloseIcon, Heading, Icon } from '../ui';

type Props = View['props'] & {
	onDismiss: () => void;
	visible: boolean;
	title: string;
	snapPoint?: string | number;
};
export default function BottomSheetTwo(props: Props) {
	const { visible, onDismiss, title, children, snapPoint, className } = props;

	return (
		<BottomSheet
			visible={visible}
			onDismiss={onDismiss}
			plain={true}
			bottomPadding={false}
			snapPoint={snapPoint}>
			<View className="bg-white pb-4 rounded-t-lg flex-1">
				<View className=" h-14 border-b border-gray-200 flex-row items-center px-4 justify-between">
					<Heading className=" text-base">{title}</Heading>
					<Pressable
						onPress={() => onDismiss()}
						className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center">
						<Icon as={CloseIcon} className="transform scale-[0.6]" />
					</Pressable>
				</View>
				<View className={cn('pt-6 flex-1', className)}>{children}</View>
			</View>
		</BottomSheet>
	);
}
