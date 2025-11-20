import React, { useState } from "react";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { CustomInput } from "../custom/CustomInput";
import { Button, ButtonText } from "../ui";
import { useMutation } from "@tanstack/react-query";
import { sendEquiry } from "@/actions/equiry";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useStore } from "@/store";
import { fullName } from "@/lib/utils";

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
  const { me } = useStore((s) => s);
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
    full_name: me ? fullName(me) : "",
    email: me?.email || "",
    message: "",
    type: "general",
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

  const types = ["sell", "enquiry", "general", "visit", "offer"];
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["75%"]}
      title="Send a Message"
      withHeader
      withScroll
      addBackground
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
          keyboardType="email-address"
          onUpdate={handleUpdate("email")}
          placeholder="Enter your email"
          type="email"
        />
        <CustomInput
          title="Message"
          value={formData.message}
          onUpdate={handleUpdate("message")}
          placeholder="Your message"
          className="pt-2 px-4"
          multiline
        />
        {/* <View className="gap-2">
          <Text>Type</Text>
          <CustomSelect
            withDropIcon
            label="Type"
            value={formData.type}
            onChange={(val) => handleUpdate("type")(val.value)}
            options={types.map((item) => ({
              label: item.toUpperCase(),
              value: item,
            }))}
            BottomSheet={OptionsBottomSheet}
          />
        </View> */}
        <CustomInput
          title="Address"
          value={formData.address}
          onUpdate={handleUpdate("address")}
          placeholder="Your address (optional)"
        />
        <Button size="xl" className="mt-4" onPress={handleSubmit}>
          {isPending && <SpinningLoader />}
          <ButtonText>Submit</ButtonText>
        </Button>
      </View>
    </BottomSheet>
  );
};

export default EnquiriesFormBottomSheet;
