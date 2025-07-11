import { sendEquiry } from "@/actions/equiry";
import { CustomInput } from "@/components/custom/CustomInput";
import CustomSelect from "@/components/custom/CustomSelect";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { Button, ButtonText, Text } from "@/components/ui";
import { showSnackbar } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ReportReviewScreen = () => {
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
  });

  const handleUpdate = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await mutateAsync({ form: formData });
  };

  const types = ["sell", "enquiry", "general", "visit", "offer"];
  return (
    <BodyScrollView withBackground className="px-4 android:py-8">
      <SafeAreaView edges={["bottom"]} className="flex-1">
        <View className="gap-6">
          <View>
            <Text className="text-sm mt-1">
              Use the form below to send a message, report an issue, submit a
              review, or make an enquiry about a property or agent. We’re here
              to help!
            </Text>
          </View>
          <CustomInput
            isBottomSheet={false}
            title="Full Name"
            value={formData.full_name}
            onUpdate={handleUpdate("full_name")}
            placeholder="Enter your full name"
          />
          <CustomInput
            isBottomSheet={false}
            title="Email"
            value={formData.email}
            onUpdate={handleUpdate("email")}
            placeholder="Enter your email"
            type="email"
          />
          <CustomInput
            isBottomSheet={false}
            title="Message"
            value={formData.message}
            onUpdate={handleUpdate("message")}
            placeholder="Your message (review/report/enquiry)"
            multiline
          />
          <View className="gap-2">
            <Text className="text-base font-medium">
              Category <Text className="text-primary">*</Text>
            </Text>
            <CustomSelect
              withDropIcon
              label="Duration"
              BottomSheet={OptionsBottomSheet}
              value={formData.type}
              valueParser={(value: any) => value || "Select Duration"}
              onChange={(val) => setFormData({ ...formData, type: val.value })}
              options={types.map((item) => ({
                label: item.toUpperCase(),
                value: item,
              }))}
            />
          </View>
          <Button size="xl" onPress={handleSubmit}>
            {isPending && <SpinningLoader />}
            <ButtonText>Send</ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    </BodyScrollView>
  );
};

export default ReportReviewScreen;
