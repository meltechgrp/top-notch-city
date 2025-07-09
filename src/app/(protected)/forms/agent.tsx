import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { View, Text, Box, Image } from "@/components/ui";
import { Link, useRouter } from "expo-router";
import { CustomInput } from "@/components/custom/CustomInput";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import ListingPhotosBottomSheet from "@/components/listing/ListingPhotosBottomSheet";
import DatePicker from "@/components/custom/DatePicker";
import { useMutation } from "@tanstack/react-query";
import { uploadAgentForm } from "@/actions/agent";
import { showSnackbar } from "@/lib/utils";
import { z } from "zod";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

const AgentFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  nin: z.string().min(1, "NIN is required"),
  birthdate: z.date({
    required_error: "Birthdate is required",
    invalid_type_error: "Birthdate must be a valid date",
  }),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  photo: z
    .array(
      z.object({
        uri: z.string(),
        id: z.string(),
      })
    )
    .min(1, "At least one photo is required"),
});

const minimumAge = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13);
export default function AgentFormScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: uploadAgentForm,
  });
  const [photosBottomSheet, setPhotosBottomSheet] = useState(false);
  const [form, setForm] = useState<AgentFormData>({
    firstname: "",
    lastname: "",
    phone: "",
    nin: "",
    birthdate: null,
    country: "",
    state: "",
    city: "",
    photo: [],
  });

  async function handleForm() {
    try {
      // ✅ Validate using Zod
      const validated = AgentFormSchema.parse({
        ...form,
        birthdate: form.birthdate ? new Date(form.birthdate) : null,
      });

      // ✅ If valid, upload
      await mutateAsync(validated, {
        onSuccess: () => {
          router.push("/forms/success");
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        // ✅ Use showSnackbar for each error combined
        const messages = err.errors[0].message;
        showSnackbar({
          message: messages,
          type: "error",
          duration: 2000,
        });
      } else {
        console.error(err);
        showSnackbar({
          message: "Something went wrong during upload.",
          type: "error",
        });
      }
    }
  }
  return (
    <Box className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <BodyScrollView withBackground className="flex-1 px-4 py-6">
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
                value={form.firstname}
                onUpdate={(text) => setForm({ ...form, firstname: text })}
                placeholder="First Name *"
              />

              <CustomInput
                isBottomSheet={false}
                className=""
                value={form.lastname}
                onUpdate={(text) => setForm({ ...form, lastname: text })}
                placeholder="Last Name *"
              />
              <DatePicker
                label=""
                placeholder="Birthdate (YYYY-MM-DD) *"
                value={form.birthdate as any}
                onChange={(val) =>
                  setForm({ ...form, birthdate: new Date(val) })
                }
                mode="date"
                className=" bg-background-muted"
                maximumDate={minimumAge}
                startDate={minimumAge}
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
              <TouchableOpacity
                className=" h-16 bg-background-muted rounded-2xl  border border-outline"
                onPress={() => setPhotosBottomSheet(true)}
              >
                <View className=" gap-4 flex-1 px-4 py-2 flex-row  items-center">
                  <Text className="text-sm font-light">Upload photo</Text>
                  {form.photo[0]?.uri && (
                    <Image
                      className=" w-12 h-12 rounded-full ml-auto"
                      source={{ uri: form.photo[0]?.uri }}
                      alt="image"
                    />
                  )}
                </View>
              </TouchableOpacity>
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
            <Pressable
              onPress={handleForm}
              disabled={isPending}
              className="bg-primary flex-row mt-6 py-3 rounded-xl justify-center gap-2 items-center"
            >
              {isPending && <SpinningLoader />}
              <Text className="text-white font-medium text-lg">
                Submit Form
              </Text>
            </Pressable>
          </View>
        </BodyScrollView>
      </KeyboardAvoidingView>

      <ListingPhotosBottomSheet
        visible={photosBottomSheet}
        photos={form.photo}
        multiple={false}
        withDescription={false}
        onDismiss={() => setPhotosBottomSheet(false)}
        deleteFile={(id) => {
          let newData = form.photo?.filter((_, i) => i + 1 != id);
          setForm({ ...form, photo: newData });
        }}
        onUpdate={async (data) => {
          let combined = [...(form.photo ?? []), ...data];
          setForm({ ...form, photo: combined });
        }}
      />
    </Box>
  );
}
