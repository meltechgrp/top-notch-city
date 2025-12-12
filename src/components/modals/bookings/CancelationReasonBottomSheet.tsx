import BottomSheet from "@/components/shared/BottomSheet";
import { Button, ButtonText, Text, View } from "@/components/ui";
import { useState } from "react";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { CustomInput } from "@/components/custom/CustomInput";

export type CancelationReasonBottomSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  onCancel: (reason: string) => Promise<void>;
  title?: string;
};

export const CancelationReasonBottomSheet: React.FC<
  CancelationReasonBottomSheetProps
> = ({ visible, onDismiss, onCancel, title }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = async (e: any) => {
    if (reason.trim().length < 3) {
      showErrorAlert({
        title: "Please provide a valid reason (min 3 characters).",
        alertType: "warn",
      });
      return;
    } else {
      onCancel(reason);
      setReason("");
      onDismiss();
    }
  };
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["65%"]}
      title={title ?? "Cancel Reservation"}
      withHeader
      backdropVariant="xl"
      withScroll
      addBackground
    >
      <View className="flex-1 px-4">
        <View className="flex-1">
          <Text className="text-center text-typography/80 text-sm">
            please give a reason for cancelation
          </Text>

          <View className="flex-1 my-3">
            <CustomInput
              value={reason}
              onUpdate={setReason}
              placeholder="Enter your reason..."
              multiline
            />
          </View>

          <View className="flex-row justify-center gap-3 mt-6">
            <Button
              className="flex-1"
              variant="outline"
              onPress={() => onDismiss()}
            >
              <ButtonText>Close</ButtonText>
            </Button>
            <Button className="flex-1" onPress={handleConfirm}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};
