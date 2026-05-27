import { ListingWrapper } from "@/components/listing/ListingWrapper";
import headerLeft from "@/components/shared/headerLeft";
import { Stack } from "expo-router";

export default function SellAddScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: headerLeft(),
          headerTitleAlign: "center",
        }}
      />
      <ListingWrapper type="add" />
    </>
  );
}
