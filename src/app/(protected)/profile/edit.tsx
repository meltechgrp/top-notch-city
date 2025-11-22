import { CustomInput } from "@/components/custom/CustomInput";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { PROFILE_FORM_CONFIG } from "@/components/profile/config";
import { Box, Button, ButtonText } from "@/components/ui";
import { useStore } from "@/store";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { useState } from "react";

export default function Edit() {
  const { key } = useGlobalSearchParams() as { key: keyof Me };
  const { me } = useStore();

  const config = PROFILE_FORM_CONFIG[key];
  const { mutation } = useProfileMutations();

  const initialState: Record<string, any> = {};
  config.fields.forEach((f) => {
    initialState[f] = me?.[f] || "";
  });

  const [form, setForm] = useState(initialState);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const payload = Object.entries(form).map(([field, value]) => ({
      field: field as keyof Me,
      value,
    }));

    await mutation.mutateAsync(payload, { onSuccess: () => router.back() });
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: config.label || `Update ${key}`,
        }}
      />

      <Box className="flex-1 p-4 gap-4">
        {config.inputs.map((input) => (
          <CustomInput
            key={input.key}
            value={form[input.key] || ""}
            onUpdate={(v) => updateField(input.key, v)}
            placeholder={input.placeholder}
            multiline={input.multiline}
          />
        ))}

        <Button size="xl" className="mt-6" onPress={handleSave}>
          {mutation.isPending && <SpinningLoader />}
          <ButtonText>Save</ButtonText>
        </Button>
      </Box>
    </>
  );
}
