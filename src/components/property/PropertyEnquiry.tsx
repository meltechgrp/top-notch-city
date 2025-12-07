import React, { useState } from "react";
import { View } from "react-native";
import { CustomInput } from "../custom/CustomInput";
import { Button, ButtonText, Icon, Text } from "../ui";
import { useMutation } from "@tanstack/react-query";
import { sendEquiry } from "@/actions/equiry";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useStore } from "@/store";
import { composeFullAddress, fullName } from "@/lib/utils";
import { Send } from "lucide-react-native";
import { ExternalLink } from "@/components/ExternalLink";

interface PropertyEnquiryProps {
  property: Property;
}

export function PropertyEnquiry({ property }: PropertyEnquiryProps) {
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
    message: `I am interested in your property at ${composeFullAddress(property.address)}`,
    type: "enquiry",
    address: "",
    property_id: property.id,
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
  };
  return (
    <View className="flex-1 p-4 gap-4 bg-background-muted rounded-xl border border-outline-100">
      <Text className="text-lg font-bold">Enquiry</Text>
      <CustomInput
        title="Full Name*"
        value={formData.full_name}
        onUpdate={handleUpdate("full_name")}
        placeholder="Enter your full name"
      />
      <CustomInput
        title="Email*"
        value={formData.email}
        keyboardType="email-address"
        onUpdate={handleUpdate("email")}
        placeholder="Enter your email"
        type="email"
      />
      <CustomInput
        title="Message*"
        value={formData.message}
        onUpdate={handleUpdate("message")}
        placeholder="Your message"
        className="pt-2 px-4"
        multiline
      />
      <CustomInput
        title="Address"
        value={formData.address}
        onUpdate={handleUpdate("address")}
        placeholder="Your address (optional)"
      />
      <Button size="xl" className="mt-4" onPress={handleSubmit}>
        {isPending ? <SpinningLoader /> : <Icon as={Send} />}
        <ButtonText>Submit</ButtonText>
      </Button>
      <Text className="text-sm leading-relaxed text-typography/80">
        By pressing Submit, you agree that TopNotch City and its affiliates, and
        real estate professionals may call/ text you about your enquiry, which
        may involve use of automated means and prerecorded/artificial voices.
        You also agree to our{" "}
        <ExternalLink href={"https://topnotchcity.com/privacy"}>
          <Text className="text-blue-600 text-sm">Terms of Use.</Text>
        </ExternalLink>{" "}
        TopNotch City does not endorse any real estate professionals. We may
        share information about your recent and future site activity with your
        agent to help them understand what you're looking for in a home
      </Text>
    </View>
  );
}
