import { Button, ButtonText } from "@/components/ui";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ListingWrapper } from "@/components/listing/ListingWrapper";

export default function PropertyEdit() {
  const { propertyId, userId } = useLocalSearchParams() as {
    propertyId: string;
    userId: string;
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Edit Property",
          headerRight: () => (
            <Button
              onPress={() => router.push("/(protected)/support/faq")}
              size="md"
              variant="outline"
              action="secondary"
              className="mb-1"
            >
              <ButtonText>Help?</ButtonText>
            </Button>
          ),
        }}
      />
      <ListingWrapper type="edit" propertyId={propertyId} userId={userId} />
    </>
  );
}
