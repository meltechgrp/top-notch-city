import * as React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import BottomSheetPlain from '@/components/shared/BottomSheetPlain';
import { FlashList } from '@shopify/flash-list';
import { Heading, Icon, Pressable, Text } from '@/components/ui';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
type OptionProps = {
	option: ConfirmationActionConfig;
	index: number;
};
export type Props = {
	onDismiss: () => void;
	withBackground?: boolean;
	propertyId: string;
	isOnwer?: boolean;
	isOpen: boolean;
	options: ConfirmationActionConfig[];
	OptionComponent: React.ComponentType<
		TouchableWithoutFeedback['props'] & OptionProps
	>;
};
export default function PropertyActionsBottomSheet(props: Props) {
	const {
		isOpen,
		onDismiss,
		options,
		OptionComponent,
		withBackground = true,
		isOnwer = false,
		propertyId,
	} = props;
	return (
		<BottomSheetPlain
			withBackground={withBackground}
			visible={isOpen}
			onDismiss={onDismiss}>
			<View
				style={{ height: (options.length + 1) * 58 }}
				className={' p-4 py-2 bg-background-muted rounded-xl overflow-hidden '}>
				<FlashList
					data={options}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.actionText}
					estimatedItemSize={56}
					ListHeaderComponent={() => (
						<>
							<View className=" items-center py-3 mb-2 border-outline border-b">
								<Heading>Property Actions</Heading>
							</View>
							{isOnwer && (
								<Pressable
									both
									onPress={() =>
										router.push({
											pathname: '/property/[propertyId]/edit',
											params: {
												propertyId,
											},
										})
									}
									className={
										'px-4 h-14 flex-row border-outline border-b justify-between rounded-xl items-center'
									}>
									<Text className="text-lg flex-1">Edit</Text>
									<Icon as={ChevronRight} />
								</Pressable>
							)}
						</>
					)}
					ItemSeparatorComponent={() => <View className=" h-2" />}
					renderItem={({ item: option, index }) => (
						<OptionComponent
							key={option.header}
							option={option}
							onPress={() => {
								onDismiss();
							}}
							index={index}
						/>
					)}
				/>
			</View>
		</BottomSheetPlain>
	);
}
