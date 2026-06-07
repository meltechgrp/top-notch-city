// @refresh reset
import { CustomInput } from "@/components/custom/CustomInput";
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
import { tempStore } from "@/store/tempStore";
import { router, Stack } from "expo-router";
import { Plus, Save, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

function buildInitialForm(
  config: (typeof PROFILE_FORM_CONFIG)[keyof typeof PROFILE_FORM_CONFIG] | null,
  me: Partial<Application> | null,
  formKey: string,
) {
  const out: Record<string, any> = {};
  if (!config) return out;

  const parseValue = (field: string): any => {
    if (config.isAddress) {
      const address = me?.address;
      if (!address || Object.keys(address).length === 0) return "";

      return JSON.stringify({
        displayName: [
          address.street,
          address.city,
          address.state,
          address.country,
        ]
          .filter(Boolean)
          .join(", "),
        addressComponents: address,
        location: {
          latitude: address.latitude,
          longitude: address.longitude,
        },
      });
    }

    // @ts-ignore
    const source = me?.[field];

    if (config.isArray) {
      return Array.isArray(source) ? source.join(", ") : "";
    }
    if (formKey === "date_of_birth") {
      return source || "";
    }
    if (config.isCompany || config.isDocument) {
      return JSON.stringify(source || []);
    }
    if (config.inputType && typeof source === "object" && source !== null) {
      return JSON.stringify(source);
    }

    return source || "";
  };

  config.inputs.forEach((input) => {
    out[input.key] = parseValue(input.key);
  });
  config.fields.forEach((field) => {
    if (out[field] === undefined) {
      out[field] = parseValue(field);
    }
  });
  return out;
}

export default function AgentFieldScreen() {
  const route = useRoute();
  const routeKey = (
    route.params as { key?: keyof ProfileUpdate | string | string[] } | undefined
  )?.key;
  const formKey = (Array.isArray(routeKey) ? routeKey[0] : routeKey) ?? "";

  const [showModal, setShowModal] = useState(false);
  const [application, setApplication] = useState(
    () => tempStore.getState().application,
  );
  const [form, setForm] = useState<Record<string, any>>({});
  const me = application ?? null;
  const config = formKey ? PROFILE_FORM_CONFIG[formKey] : null;

  useEffect(() => {
    return tempStore.subscribe((state) => {
      setApplication(state.application);
    });
  }, []);

  useEffect(() => {
    if (!config) {
      router.replace("/forms/agent");
    }
  }, [config]);

  useEffect(() => {
    setForm(buildInitialForm(config, me, formKey));
  }, [config, me, formKey]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!config) return;

    if (config.isAddress) {
      const data = JSON.parse(form.address || "null");
      if (!data?.addressComponents) return;

      let address: any = {};
      Object.entries(data?.addressComponents).forEach(([field, value]) => {
        address[field] = value;
      });
      address["latitude"] = data?.location?.latitude;
      address["longitude"] = data?.location?.longitude;
      tempStore.getState().updateApplication({
        address: address,
      });
    } else if (config.isDocument) {
      const data = JSON.parse(form[formKey] || "[]");
      tempStore.getState().updateApplication({
        documents: Array.isArray(data) ? data : [],
      });
    } else if (config.isArray) {
      const data = String(form[formKey] || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      tempStore.getState().updateApplication({
        [formKey]: data,
      });
    } else {
      Object.entries(form).forEach(([field, value]) => {
        tempStore.getState().updateApplication({
          [field]: value as string,
        });
      });
    }
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: config?.label || "Update",
          headerTitleAlign: "center",
          headerRight: () =>
            config?.showAddBtn ? (
              <Pressable
                className={cn(
                  "items-center w-20 and gap-2 px-3 flex-row",
                  config.isAddress && "w-28",
                )}
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

      {!config ? (
        <View className="flex-1" />
      ) : (
        <Box className="flex-1 android:border-t border-outline-100">
          <KeyboardDismissPressable className="gap-2 flex flex-col p-4">
            <View className="mb-4">
              <Text className="text-2xl font-medium">
                {config.label || `Update ${formKey}`}
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
              <Icon as={Save} />
              <ButtonText>Save</ButtonText>
            </Button>
          </KeyboardDismissPressable>
        </Box>
      )}
    </>
  );
}
