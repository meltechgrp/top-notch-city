import { CustomInput } from "@/components/custom/CustomInput";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { Button, ButtonText, Text } from "@/components/ui";
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ReportReviewScreen = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
    type: "",
  });

  const handleUpdate = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const submission = {
      ...formData,
      submitted_at: new Date().toISOString(),
    };
    console.log("User submission:", submission);
  };

  return (
    <BodyScrollView withBackground className="px-4 android:py-8">
      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <View className="gap-6">
          <View>
            <Text className="text-2xl font-bold">Contact Admin</Text>
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
          <CustomInput
            isBottomSheet={false}
            title="Type"
            value={formData.type}
            onUpdate={handleUpdate("type")}
            placeholder="Type of report (e.g. 'review', 'complaint', 'question')"
          />
          <Button onPress={handleSubmit}>
            <ButtonText>Send</ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    </BodyScrollView>
  );
};

export default ReportReviewScreen;
