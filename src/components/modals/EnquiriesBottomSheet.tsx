import React, { useState } from "react";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { CustomInput } from "../custom/CustomInput";
import { Button, ButtonText } from "../ui";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const EnquiriesFormBottomSheet: React.FC<Props> = ({ visible, onDismiss }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
    type: "",
    address: "",
  });

  const handleUpdate = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const enquiry = {
      ...formData,
      address: formData.address || null,
    };
    console.log("Submitting enquiry:", enquiry);
    onDismiss();
  };

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["80%"]}
      title="Send an Enquiry"
      withHeader
    >
      <View className="flex-1 p-4 gap-6">
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
          title="Type"
          value={formData.type}
          onUpdate={handleUpdate("type")}
          placeholder="Enquiry type"
        />
        <CustomInput
          title="Address"
          value={formData.address}
          onUpdate={handleUpdate("address")}
          placeholder="Your address (optional)"
        />
        <Button onPress={handleSubmit}>
          <ButtonText>Submit</ButtonText>
        </Button>
      </View>
    </BottomSheet>
  );
};

export default EnquiriesFormBottomSheet;
