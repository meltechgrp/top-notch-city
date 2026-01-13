import { ListingWrapper } from "@/components/listing/ListingWrapper";
import headerLeft from "@/components/shared/headerLeft";
import { listingStore } from "@/store/listing";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function SellAddScreen() {
  const { userId } = useLocalSearchParams() as { userId: string };

  useEffect(() => {
    listingStore.resetListing();
  }, []);
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
