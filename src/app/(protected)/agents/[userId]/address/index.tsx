import { getUser } from "@/actions/user";
import { CustomInput } from "@/components/custom/CustomInput";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { PROFILE_FORM_CONFIG } from "@/components/profile/config";
import { Box, Button, ButtonText, Text } from "@/components/ui";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { useQuery } from "@tanstack/react-query";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

export default function Address() {
  const { key, userId } = useGlobalSearchParams() as {
    key: keyof ProfileUpdate;
    userId: string;
  };
  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const me = useMemo(() => data ?? null, [data]);
  const { mutation } = useProfileMutations(userId);
  const config = PROFILE_FORM_CONFIG[key];

  const initialState: Record<string, string> = {};
  config.fields.forEach((field) => {
    //@ts-ignore
    initialState[field] = me?.address?.[field] || "";
  });

  const [form, setForm] = useState(initialState);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    const payload = Object.entries(form).map(([field, value]) => ({
      field: field as keyof ProfileUpdate,
      value,
    }));

    await mutation.mutateAsync(payload, { onSuccess: () => router.back() });
  }

  return (
    <>
      <Stack.Screen options={{ title: config.label }} />
      <Box className="flex-1 p-4 gap-4">
        <Text className="text-base text-foreground/90">
          {config.description}
        </Text>

        {config.context && (
          <Text className="text-sm text-foreground/70">{config.context}</Text>
        )}

        {config.inputs.map((input) => (
          <CustomInput
            key={input.key}
            value={form[input.key]}
            placeholder={input.placeholder}
            multiline={input.multiline}
            onUpdate={(v) => updateField(input.key, v)}
          />
        ))}

        <Button className="mt-6" size="xl" onPress={save}>
          {mutation.isPending && <SpinningLoader />}
          <ButtonText>Save</ButtonText>
        </Button>
      </Box>
    </>
  );
}
