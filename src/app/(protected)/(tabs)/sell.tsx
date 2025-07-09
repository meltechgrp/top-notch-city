import { openSignInModal } from "@/components/globals/AuthModals";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Icon,
  Image,
  Text,
  View,
} from "@/components/ui";
import { useStore } from "@/store";
import { useLayout } from "@react-native-community/hooks";
import { Stack, useRouter } from "expo-router";
import { MoveRight } from "lucide-react-native";
import { useMemo } from "react";

export default function SellScreen() {
  const router = useRouter();
  const { me, hasAuth } = useStore();
  const { onLayout, height } = useLayout();

  const isAgent = useMemo(() => me?.role === "agent", [me]);
  const isAdmin = useMemo(() => me?.role === "admin", [me]);
  const isUser = useMemo(() => me?.role === "user", [me]);

  function handleGetStarted() {
    if (!hasAuth) {
      return openSignInModal({ visible: true });
    }

    if (isAgent) {
      router.push("/listing/add");
    } else if (isUser) {
      router.push("/forms/agent"); // Example: route to become an agent
    }
  }

  function renderContent() {
    // Not logged in
    if (!hasAuth) {
      return (
        <View className="bg-background-muted rounded-xl p-6">
          <Heading size="xl">Become an Agent to List Properties</Heading>
          <Text size="sm" className="font-light mb-4 mt-2">
            To list a property, please sign in or create an agent account.
            Agents have access to tools for managing listings and inquiries.
          </Text>
          <Button
            onPress={() => openSignInModal({ visible: true })}
            size="xl"
            className="mt-6 rounded"
          >
            <ButtonText>Sign In</ButtonText>
            <Icon size="xl" as={MoveRight} className="text-white" />
          </Button>
        </View>
      );
    }

    // Agent
    if (isAgent) {
      return (
        <View className="bg-background-muted rounded-xl p-6">
          <Heading size="xl">Ready to List Your Property?</Heading>
          <Text size="sm" className="font-light mb-4 mt-2">
            Easily list your property, add details, photos, and reach thousands
            of potential buyers or renters.
          </Text>
          <Button onPress={handleGetStarted} size="xl" className="mt-6 rounded">
            <ButtonText>Get Started</ButtonText>
            <Icon size="xl" as={MoveRight} className="text-white" />
          </Button>
        </View>
      );
    }

    // Normal User
    if (isUser) {
      return (
        <View className="bg-background-muted rounded-xl p-6">
          <Heading size="xl">Agents Only</Heading>
          <Text size="sm" className="font-light mb-4 mt-2">
            Only verified agents can list properties. Become an agent to access
            full listing features and reach more clients.
          </Text>
          <Button onPress={handleGetStarted} size="xl" className="mt-6 rounded">
            <ButtonText>Become an Agent</ButtonText>
            <Icon size="xl" as={MoveRight} className="text-white" />
          </Button>
        </View>
      );
    }

    // Admin
    if (isAdmin) {
      return (
        <View className="bg-red-100 border border-red-400 rounded-xl p-6">
          <Heading size="xl" className="text-red-600">
            Action Not Allowed
          </Heading>
          <Text size="sm" className="font-light mb-4 mt-2 text-red-500">
            Admin accounts are not permitted to list properties. Please use an
            agent account for property listings.
          </Text>
        </View>
      );
    }

    // Fallback
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <Box onLayout={onLayout} className="flex-1">
        <BodyScrollView className="flex-1">
          <View
            style={{
              height: height / 2.2,
            }}
            className="flex-1 p-4 mt-4 overflow-hidden"
          >
            <Image
              source={require("@/assets/images/landing/agent.png")}
              alt="sell banner"
              className={`object-cover object-bottom rounded-3xl min-h-32 w-full flex-1`}
            />
          </View>

          <View className="px-4 py-6 gap-4 flex-1">
            {renderContent()}

            <View className="mt-4 rounded-xl flex-row gap-4">
              <Button
                onPress={() => router.push("/property/locations")}
                size="md"
                className="flex-1 h-12 bg-background-muted border-b-[1px] border-primary rounded"
              >
                <ButtonText className="text-typography">
                  Browse Locations
                </ButtonText>
              </Button>
              <Button
                onPress={() => router.push("/property/section")}
                size="md"
                className="flex-1 h-12 bg-background-muted border-b-[1px] border-primary rounded"
              >
                <ButtonText className="text-typography">
                  View Properties
                </ButtonText>
              </Button>
            </View>
          </View>
        </BodyScrollView>
      </Box>
    </>
  );
}
