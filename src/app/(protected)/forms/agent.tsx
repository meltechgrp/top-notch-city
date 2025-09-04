import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { View, Text, Box, Image, Icon } from "@/components/ui";
import { Link, useRouter } from "expo-router";
import { CustomInput } from "@/components/custom/CustomInput";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import DatePicker from "@/components/custom/DatePicker";
import { useMutation } from "@tanstack/react-query";
import { uploadAgentForm } from "@/actions/agent";
import { z } from "zod";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import ProfileImageBottomSheet from "@/components/agent/ProfileImageBottomSheet";
import { profileDefault } from "@/store";
import { Edit } from "lucide-react-native";
import { showErrorAlert } from "@/components/custom/CustomNotification";

const AgentFormSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  // nin: z.string().min(1, "NIN is required"),
  birthdate: z.date({
    error: "Birthdate is required",
  }),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  photo: z.string().min(1, "At least one photo is required"),
});

const minimumAge = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13);
export default function AgentFormScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: uploadAgentForm,
  });
  const [photosBottomSheet, setPhotosBottomSheet] = useState(false);
  const [form, setForm] = useState<AgentFormData>({
    phone: "",
    // nin: "",
    birthdate: null,
    country: "",
    state: "",
    city: "",
    photo: "",
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
        showErrorAlert({
          title: "Something went wrong during upload.",
          alertType: "error",
          duration: 2000,
        });
      } else {
        showErrorAlert({
          title: "Something went wrong during upload.",
          alertType: "error",
        });
      }
    }
  }
  return (
    <Box className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BodyScrollView withBackground className="flex-1 px-4 py-6">
          <View className="gap-6">
            <Text className="text-sm font-light text-center">
              Fill out the required information below to register an agent
              profile.
            </Text>

            {/* Personal Information */}
            <View className="gap-4 mt-4">
              <TouchableOpacity
                className=" mx-auto w-40 h-40 mb-4 relative"
                onPress={() => setPhotosBottomSheet(true)}
              >
                <Image
                  style={{ borderRadius: 100 }}
                  source={form?.photo || profileDefault}
                  alt="image"
                />
                <View className=" absolute bottom-0 right-2">
                  <Icon size="sm" as={Edit} />
                </View>
              </TouchableOpacity>
              <CustomInput
                isBottomSheet={false}
                className=""
                value={form.phone}
                onUpdate={(text) => setForm({ ...form, phone: text })}
                placeholder="Phone Number *"
                keyboardType="phone-pad"
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

              {/* <CustomInput
                isBottomSheet={false}
                className=""
                value={form.nin}
                onUpdate={(text) => setForm({ ...form, nin: text })}
                placeholder="National ID Number (NIN) *"
                keyboardType="numeric"
              /> */}
            </View>

            {/* Location Information */}
            <View className="gap-4 mt-6">
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
                placeholder="City"
              />
            </View>

            {/* Terms & Conditions */}
            <View className="mt-8 items-center">
              <Text className="text-sm text-center">
                By submitting this form, you agree to our{" "}
                <Link
                  href="https://topnotchcity.com/terms"
                  target="_blank"
                  className="text-primary underline"
                >
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

      <ProfileImageBottomSheet
        visible={photosBottomSheet}
        onSave={(file) => setForm({ ...form, photo: file[0].uri })}
        onDismiss={() => setPhotosBottomSheet(false)}
      />
    </Box>
  );
}
