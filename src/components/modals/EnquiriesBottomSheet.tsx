import React, { useState } from "react";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { CustomInput } from "../custom/CustomInput";
import { Button, ButtonText } from "../ui";
import { useMutation } from "@tanstack/react-query";
import { sendEquiry } from "@/actions/equiry";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  id?: string;
};

const EnquiriesFormBottomSheet: React.FC<Props> = ({
  visible,
  onDismiss,
  id,
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendEquiry,
    onSuccess: () =>
      showErrorAlert({
        title: "Message sent successfully",
        alertType: "success",
      }),
    onError: (err) =>
      showErrorAlert({
        title: "Something went wrong, try again!",
        alertType: "error",
      }),
  });
  const [formData, setFormData] = useState<Enquiry>({
    full_name: "",
    email: "",
    message: "",
    type: "enquiry",
    address: "",
    property_id: id,
  });

  const handleUpdate = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email || !formData.message)
      return showErrorAlert({
        title: "Please fill up all fields",
        alertType: "warn",
      });
    await mutateAsync({ form: formData });
    onDismiss();
  };

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["80%"]}
      title="Send an Message"
      withHeader
      withScroll
    >
      <View className="flex-1 p-4 gap-4">
        <CustomInput
          title="Full Name"
          value={formData.full_name}
          onUpdate={handleUpdate("full_name")}
          placeholder="Enter your full name"
        />
        <CustomInput
          title="Email"
          value={formData.email}
          onUpdate={handleUpdate("email")}
          placeholder="Enter your email"
          type="email"
        />
        <CustomInput
          title="Message"
          value={formData.message}
          onUpdate={handleUpdate("message")}
          placeholder="Your message"
          multiline
        />
        <CustomInput
          title="Address"
          value={formData.address}
          onUpdate={handleUpdate("address")}
          placeholder="Your address (optional)"
        />
        <Button size="xl" onPress={handleSubmit}>
          {isPending && <SpinningLoader />}
          <ButtonText>Submit</ButtonText>
        </Button>
      </View>
    </BottomSheet>
  );
};

export default EnquiriesFormBottomSheet;
