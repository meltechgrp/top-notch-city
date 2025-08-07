import { Button, ButtonText, View, Box, Icon } from "@/components/ui";
import React, { useState } from "react";
import { Loader } from "lucide-react-native";
import { saveAuthToken } from "@/lib/secureStore";
import { useStore, useTempStore } from "@/store";
import { AuthSignupInput } from "@/lib/schema";
import { hapticFeed } from "@/components/HapticTab";
import { showSnackbar } from "@/lib/utils";
import eventBus from "@/lib/eventBus";
import BottomSheet from "@/components/shared/BottomSheet";
import { authSignup } from "@/actions/auth";
import { CustomInput } from "@/components/custom/CustomInput";

export default function SignUpBottomSheet({
  visible,
  onDismiss,
  isAgentRequest,
}: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = React.useState<AuthSignupInput>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    comfirmPassword: "",
  });

  const handleSubmit = async () => {
    hapticFeed();
    setLoading(true);
    try {
      const state = await authSignup(form);
      if (state?.fieldError) {
        const message = Object.values(state.fieldError).filter(Boolean)[0];
        showSnackbar({
          message,
          type: "error",
        });
      } else if (state?.formError) {
        showSnackbar({
          message: state.formError,
          type: "error",
        });
      } else if (state?.data) {
        const { email, message, access_token } = state.data as {
          access_token: string;
          message: string;
          email: string;
        };
        showSnackbar({
          message: message,
          type: "success",
        });
        if (access_token) {
          saveAuthToken(access_token);
        }

        useTempStore.setState((v) => ({
          ...v,
          kyc: {
            email: form.email,
          },
        }));

        useStore.setState((s) => ({
          ...s,
          hasAuth: true,
        }));
        eventBus.dispatchEvent("openEmailVerificationModal", {
          visible: true,
          isAgentRequest: isAgentRequest,
        });
        onDismiss?.();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <BottomSheet
      withHeader
      title="Create an Account"
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["65%"]}
    >
      <Box className=" flex-1  gap-6 mt-4  rounded-xl py-6 px-4">
        <View className="flex-1 gap-4">
          <CustomInput
            className="bg-background-muted"
            value={form.first_name}
            onUpdate={(text) => setForm({ ...form, first_name: text })}
            placeholder="First Name"
          />
          <CustomInput
            className="bg-background-muted"
            value={form.last_name}
            onUpdate={(text) => setForm({ ...form, last_name: text })}
            placeholder="Last Name"
          />
          <CustomInput
            className="bg-background-muted"
            value={form.email}
            onUpdate={(text) => setForm({ ...form, email: text })}
            placeholder="Email address"
          />
          <CustomInput
            className="bg-background-muted"
            type={"password"}
            value={form.password}
            onUpdate={(text) => setForm({ ...form, password: text })}
            placeholder="Password"
          />
          <CustomInput
            type={"password"}
            className="bg-background-muted"
            value={form.comfirmPassword}
            onUpdate={(text) => setForm({ ...form, comfirmPassword: text })}
            placeholder="Comfirm password"
          />
          <Button
            variant="solid"
            className="w-full mt-4 gap-2"
            size="xl"
            onPress={handleSubmit}
          >
            {loading && (
              <Icon as={Loader} color="white" className=" animate-spin" />
            )}
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </View>
      </Box>
    </BottomSheet>
  );
}
