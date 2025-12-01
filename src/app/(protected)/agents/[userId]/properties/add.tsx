import { ListingWrapper } from "@/components/listing/ListingWrapper";
import headerLeft from "@/components/shared/headerLeft";
import { Stack, useLocalSearchParams } from "expo-router";

export default function SellAddScreen() {
  const { userId } = useLocalSearchParams() as { userId: string };
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: headerLeft(),
          headerTitleAlign: "center",
        }}
      />
      <ListingWrapper userId={userId} type="add" />
    </>
  );
}
