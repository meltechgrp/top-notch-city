import { Button, ButtonText } from "@/components/ui";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProperty } from "@/actions/property";
import { useEffect } from "react";
import { useTempStore } from "@/store";
import { composeFullAddress } from "@/lib/utils";
import { ListingWrapper } from "@/components/listing/ListingWrapper";

export default function PropertyEdit() {
  const { propertyId } = useLocalSearchParams() as { propertyId: string };
  const { updateListing } = useTempStore();
  const { data } = useQuery({
    queryKey: ["properties", propertyId],
    queryFn: () => fetchProperty({ id: propertyId }),
  });
  useEffect(() => {
    if (data) {
      updateListing({
        title: data.title,
        description: data?.description || "",
        duration: data?.duration,
        purpose: data.purpose,
        category: data.category.name,
        bedroom: data.bedroom,
        bathroom: data.bathroom,
        bedType: data.bedType,
        guests: data.guests,
        landarea: data.landarea,
        plots: data.plots,
        viewType: data.viewType,
        discount: data.discount,
        caution_fee: data.caution_fee,
        owner_type: data.owner_type,
        listing_role: data.listing_role,
        subCategory: data.subcategory.name,
        companies: data.companies,
        ownership_documents: data?.ownership?.documents?.map((d) => ({
          media_type: d.document_type?.toUpperCase() as Media["media_type"],
          id: d.id,
          url: d.file_url,
        })),
        price: data.price.toString(),
        photos: data.media?.filter((img) => img.media_type == "IMAGE"),
        videos: data.media?.filter((img) => img.media_type == "VIDEO"),
        currency: {
          code: data?.currency?.code || "NGN",
          symbol: data?.currency?.symbol || "#",
        },
        availabilityPeriod: data?.availabilities.map((a) => ({
          start: a.start,
          end: a.end,
        })),
        facilities: data?.amenities?.map((f) => f.name),
        address: {
          displayName: composeFullAddress(data.address),
          addressComponents: {
            country: data.address.country,
            state: data.address.state,
            city: data.address.city,
            street: data.address.street,
          },
          location: {
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          },
        },
      });
    }
  }, [propertyId, data]);
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
      <ListingWrapper
        type="edit"
        propertyId={propertyId}
        userId={data?.owner.id!}
      />
    </>
  );
}
