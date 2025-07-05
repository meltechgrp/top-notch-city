import React, { useState } from "react";
import { ScrollView, Pressable } from "react-native";
import { View, Text, Box } from "@/components/ui";
import { Link } from "expo-router";
import { CustomInput } from "@/components/custom/CustomInput";

export default function AgentFormScreen() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
    nin: "",
    birthdate: "",
    country: "",
    state: "",
    city: "",
    additional_fields: "",
    photo: null,
    documents: [],
  });

  return (
    <Box className="flex-1">
      <ScrollView className="flex-1 bg-background px-4 py-6">
        <View className="gap-6">
          <Text className="text-xl font-semibold">
            📋 Agent Submission Form
          </Text>
          <Text className="text-sm font-light">
            Fill out the required information below to register an agent
            profile.
          </Text>

          {/* Personal Information */}
          <View className="gap-4 mt-4">
            <Text className="text-base font-medium">Personal Details</Text>

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.first_name}
              onUpdate={(text) => setForm({ ...form, first_name: text })}
              placeholder="First Name *"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.last_name}
              onUpdate={(text) => setForm({ ...form, last_name: text })}
              placeholder="Last Name *"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.middle_name}
              onUpdate={(text) => setForm({ ...form, middle_name: text })}
              placeholder="Middle Name (Optional)"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.birthdate}
              onUpdate={(text) => setForm({ ...form, birthdate: text })}
              placeholder="Birthdate (YYYY-MM-DD) *"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.phone}
              onUpdate={(text) => setForm({ ...form, phone: text })}
              placeholder="Phone Number *"
              keyboardType="phone-pad"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.nin}
              onUpdate={(text) => setForm({ ...form, nin: text })}
              placeholder="National ID Number (NIN) *"
              keyboardType="numeric"
            />
          </View>

          {/* Location Information */}
          <View className="gap-4 mt-6">
            <Text className="text-base font-medium">Location</Text>

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.country}
              onUpdate={(text) => setForm({ ...form, country: text })}
              placeholder="Country *"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.state}
              onUpdate={(text) => setForm({ ...form, state: text })}
              placeholder="State *"
            />

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.city}
              onUpdate={(text) => setForm({ ...form, city: text })}
              placeholder="City *"
            />
          </View>

          {/* Additional Details */}
          <View className="gap-4 mt-6">
            <Text className="text-base font-medium">Extras</Text>

            <CustomInput
              isBottomSheet={false}
              className=""
              value={form.additional_fields}
              onUpdate={(text) => setForm({ ...form, additional_fields: text })}
              placeholder="Additional Notes or Info (Optional)"
              multiline
            />

            {/* <CustomUpload
          label="Upload Passport Photo"
          value={form.photo}
          onUpload={(binary) => setForm({ ...form, photo: binary })}
        /> */}

            {/* <CustomUpload
          label="Upload Documents"
          multiple
          value={form.documents}
          onUpload={(docs) => setForm({ ...form, documents: docs })}
        /> */}
          </View>

          {/* Terms & Conditions */}
          <View className="mt-8 items-center">
            <Text className="text-sm text-center">
              By submitting this form, you agree to our{" "}
              <Link href="/home" className="text-primary underline">
                Terms & Conditions
              </Link>
              .
            </Text>
          </View>

          {/* Submit Button (Placeholder) */}
          <Pressable className="bg-primary mt-6 py-3 rounded-xl items-center">
            <Text className="text-white font-medium text-lg">Submit Form</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Box>
  );
}
