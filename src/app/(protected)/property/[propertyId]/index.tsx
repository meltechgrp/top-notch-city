import { useLocalSearchParams } from "expo-router";
import PropertyWrapper from "@/components/property/PropertyWrapper";

export default function Property() {
  const { propertyId } = useLocalSearchParams() as { propertyId: string };
  return (
    <>
      <PropertyWrapper slug={propertyId} />
    </>
  );
}
