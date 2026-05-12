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
import { Plus, Save, Search } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Edit() {
  const { key, userId } = useGlobalSearchParams() as {
    key: keyof ProfileUpdate;
    userId: string;
  };
  const { mutation } = useProfileMutations(userId);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  const me = user ?? null;
  const config = key ? PROFILE_FORM_CONFIG[key] : null;

  const parseValue = useCallback(
    (field: string): any => {
      if (!config) return "";

      if (config.isAddress) {
        const addressComponents = config.fields.reduce(
          (out, addressField) => {
            // @ts-ignore
            const value = me?.[addressField];

            if (value !== undefined && value !== null && value !== "") {
              out[addressField] = value;
            }

            return out;
          },
          {} as Record<string, any>,
        );

        if (Object.keys(addressComponents).length === 0) return "";

        return JSON.stringify({
          displayName: [
            addressComponents.street,
            addressComponents.city,
            addressComponents.state,
            addressComponents.country,
          ]
            .filter(Boolean)
            .join(", "),
          addressComponents,
          location: {
            latitude: addressComponents.latitude,
            longitude: addressComponents.longitude,
          },
        });
      }

      const source = config.isCompany
        ? // @ts-ignore
          me?.agent_profile?.companies
        : config.isAgent
          ? // @ts-ignore
            me?.agent_profile?.[field]
          : // @ts-ignore
            me?.[field];

      if (config.isArray) {
        return Array.isArray(source) ? source.join(",") : "";
      }
      if (key == "date_of_birth") {
        return source || "";
      }
      if (config.isCompany || config.inputType) {
        return JSON.stringify(source || "");
      }

      return source || "";
    },
    [config, key, me],
  );

  const initialState = useMemo(() => {
    const out: Record<string, any> = {};

    config?.inputs.forEach((input) => {
      out[input.key] = parseValue(input.key);
    });

    config?.fields.forEach((field) => {
      if (out[field] === undefined) {
        out[field] = parseValue(field);
      }
    });

    return out;
  }, [config, parseValue]);

  useEffect(() => {
    if (!config) {
      router.canGoBack()
        ? router.back()
        : router.push(`/agents/${userId}/account`);
    }
  }, [config, userId]);

  useEffect(() => {
    if (!config || isLoading || !me) return;
    setForm(initialState);
  }, [config, initialState, isLoading, me]);

  const parsedValue = useMemo(() => {
    if (!config?.inputType) return null;

    try {
      const value = form[key];

      if (config.isArray) {
        return String(value || "")
          .split(",")
          .map((v: string) => v.trim())
          .filter((v: string) => v.length > 0);
      }

      return JSON.parse(value || "null");
    } catch {
      return null;
    }
  }, [config, form, key]);

  const disabled = useMemo(() => {
    if (!config?.inputType || !Array.isArray(parsedValue)) return false;

    const max = config.maxLength || 0;
    return parsedValue.length >= max;
  }, [config, parsedValue]);

  const hideSave = useMemo(() => {
    if (!config?.inputType) return false;

    if (config.isAddress && parsedValue) return false;
    if (config.showAddBtn && !Array.isArray(parsedValue)) return true;

    if (Array.isArray(parsedValue)) {
      return parsedValue.length < 1;
    }

    return false;
  }, [config, parsedValue]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!config) return;

    let payload: {
      field: keyof ProfileUpdate;
      value: any;
    }[] = [];

    if (config.isAddress) {
      const data = JSON.parse(form[key] || "null");

      if (!data?.addressComponents) return;

      payload = Object.entries(data.addressComponents).map(
        ([field, value]) => ({
          field: field as keyof ProfileUpdate,
          value,
        }),
      );

      if (data.location?.latitude !== undefined) {
        payload.push({
          field: "latitude",
          value: data.location.latitude,
        });
      }

      if (data.location?.longitude !== undefined) {
        payload.push({
          field: "longitude",
          value: data.location.longitude,
        });
      }
    } else {
      payload = Object.entries(form).map(([field, value]) => ({
        field: field as keyof ProfileUpdate,
        value,
      }));
    }

    await mutation.mutateAsync(payload, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  if (!config || isLoading || !me) {
    return (
      <View className="flex-1 items-center justify-center">
        <SpinningLoader />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Update",
          headerTitleAlign: "center",
          headerRight: () =>
            config?.showAddBtn ? (
              <Pressable
                className={cn(
                  "items-center w-20 and gap-2 px-3 flex-row",
                  config.isAddress && "w-28",
                )}
                disabled={disabled}
                onPress={() => setShowModal(true)}
              >
                <Text className="text-base font-bold">
                  {config.isAddress ? "Search" : "Add"}
                </Text>
                <Icon
                  className="w-6 h-6 text-primary"
                  as={config.isAddress ? Search : Plus}
                />
              </Pressable>
            ) : undefined,
        }}
      />

      <Box className="flex-1 android:border-t border-outline-100">
        <KeyboardDismissPressable className="gap-2 flex flex-col p-4">
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

          <Button
            size="xl"
            className={cn("mt-6", hideSave && "hidden")}
            onPress={handleSave}
          >
            {mutation.isPending ? <SpinningLoader /> : <Icon as={Save} />}
            <ButtonText>Save</ButtonText>
          </Button>
        </KeyboardDismissPressable>
      </Box>
    </>
  );
}
