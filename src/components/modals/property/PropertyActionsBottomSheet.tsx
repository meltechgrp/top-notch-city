import * as React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import BottomSheetPlain from "@/components/shared/BottomSheetPlain";
import { FlashList } from "@shopify/flash-list";
import { Heading, Icon, Pressable, Text } from "@/components/ui";

type OptionProps = {
  option: ConfirmationActionConfig;
  index: number;
};
export type Props = {
  onDismiss: () => void;
  withBackground?: boolean;
  isOpen: boolean;
  options: ConfirmationActionConfig[];
  OptionComponent: React.ComponentType<
    TouchableWithoutFeedback["props"] & OptionProps
  >;
};
export default function PropertyActionsBottomSheet(props: Props) {
  const {
    isOpen,
    onDismiss,
    options,
    OptionComponent,
    withBackground = true,
  } = props;
  return (
    <BottomSheetPlain
      withBackground={withBackground}
      visible={isOpen}
      onDismiss={onDismiss}
    >
      <View
        style={{ height: (options.length + 1) * 58 }}
        className={" p-4 py-2 bg-background-muted rounded-xl overflow-hidden "}
      >
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
