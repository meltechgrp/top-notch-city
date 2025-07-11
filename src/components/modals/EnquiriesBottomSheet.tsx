import React, { useState } from "react";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { CustomInput } from "../custom/CustomInput";
import { Button, ButtonText } from "../ui";
import { useMutation } from "@tanstack/react-query";
import { sendEquiry } from "@/actions/equiry";
import { showSnackbar } from "@/lib/utils";
import { SpinningLoader } from "../loaders/SpinningLoader";

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
  console.log(id);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendEquiry,
    onSuccess: () =>
      showSnackbar({
        message: "Message sent successfully",
        type: "success",
      }),
    onError: (err) =>
      showSnackbar({
        message: err.message,
        type: "error",
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
    await mutateAsync({ form: formData });
    onDismiss();
  };

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["75%"]}
      title="Send an Enquiry"
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
