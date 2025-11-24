import { getUser } from "@/actions/user";
import { CustomInput } from "@/components/custom/CustomInput";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { PROFILE_FORM_CONFIG } from "@/components/profile/config";
import { KeyboardDismissPressable } from "@/components/shared/KeyboardDismissPressable";
import {
  Box,
  Button,
  ButtonText,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { useQuery } from "@tanstack/react-query";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { Plus, Save } from "lucide-react-native";
import { useMemo, useState } from "react";

export default function Edit() {
  const { key, userId } = useGlobalSearchParams() as {
    key: keyof ProfileUpdate;
    userId: string;
  };
  const [showModal, setShowModal] = useState(false);
  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const me = useMemo(() => data ?? null, [data]);
  if (!key || !PROFILE_FORM_CONFIG[key]) {
    return router.push(`/agents/${userId}/account`);
  }
  const config = PROFILE_FORM_CONFIG[key];
  const { mutation } = useProfileMutations(userId);

  const initialState: Record<string, any> = {};
  config.fields.forEach((f) => {
    if (config.isCompany) {
      initialState[f] = JSON.stringify(
        // @ts-ignore
        me?.agent_profile?.companies?.[f] || ""
      );
    } else if (config.isAgent) {
      if (config.isArray) {
        // @ts-ignore
        initialState[f] = me?.agent_profile?.[f]?.join(",") || "";
      } else if (config.inputType) {
        initialState[f] = JSON.stringify(
          // @ts-ignore
          me?.agent_profile?.[f] || ""
        );
      } else {
        // @ts-ignore
        initialState[f] = me?.agent_profile?.[f] || "";
      }
    } else {
      // @ts-ignore
      initialState[f] = me?.[f] || "";
    }
  });

  const [form, setForm] = useState(initialState);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const payload = Object.entries(form).map(([field, value]) => ({
      field: field as keyof ProfileUpdate,
      value,
    }));

    await mutation.mutateAsync(payload, { onSuccess: () => router.back() });
  }
  function addItem() {
    setShowModal(true);
  }
  const disabled = useMemo(() => {
    try {
      if (!config.inputType) return false;
      const val = JSON.parse(form[key]);
      const max = config?.maxLength || 0;
      if (Array.isArray(val)) {
        return val?.length >= max;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [form, config]);
  const hideSave = useMemo(() => {
    try {
      if (!config.inputType) return false;
      const val = JSON.parse(form[key]);
      if (config?.showAddBtn && !Array.isArray(val)) {
        return true;
      } else if (Array.isArray(val)) {
        return val?.length < 0;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [form, config]);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Update Profile",
          headerRight: () =>
            config?.showAddBtn ? (
              <Pressable
                className="items-center gap-2 px-3 flex-row"
                disabled={disabled}
                onPress={addItem}
              >
                <Text className="text-base font-bold">Add</Text>
                <Icon className=" w-6 h-6 text-primary" as={Plus} />
              </Pressable>
            ) : undefined,
        }}
      />
      <Box className="flex-1 android:border-t border-outline-100">
        <KeyboardDismissPressable className=" gap-2 flex flex-col p-4">
          <View className="mb-4">
            <Text className="text-2xl font-medium">
              {config.label || `Update ${key}`}
            </Text>
            <Text className="text-sm text-typography/80 max-w-[70%]">
              {config.context}
            </Text>
          </View>

          <View className="gap-4 mt-4">
            {config.inputs.map((input) => (
              <CustomInput
                key={input.key}
                inputType={config.inputType}
                value={form[input.key] || ""}
                onUpdate={(v) => updateField(input.key, v)}
                placeholder={input.placeholder}
                multiline={input.multiline}
                showModal={showModal}
                setShowModal={setShowModal}
              />
            ))}
          </View>
          <Button size="xl" className={cn("mt-6")} onPress={handleSave}>
            {mutation.isPending ? <SpinningLoader /> : <Icon as={Save} />}
            <ButtonText>Save</ButtonText>
          </Button>
        </KeyboardDismissPressable>
      </Box>
    </>
  );
}
