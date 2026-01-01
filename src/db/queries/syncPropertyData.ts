import { useCallback, useEffect, useRef, useState } from "react";
import { syncProperties } from "@/db/sync/property";
import { fetchProperty, viewProperty } from "@/actions/property";
import { listingStore } from "@/store/listing";
import { compareDates, getLocalProperty } from "@/db/helpers";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const BATCH_SIZE = 10;

export function usePropertyDataSync(id: string, auto = true) {
  const [syncing, setSyncing] = useState(false);
  const { isInternetReachable, isConnected } = useNetworkStatus();
  const hasAutoSynced = useRef(false);
  const resync = useCallback(async () => {
    console.log("starting property sync");
    if (syncing || !id) return;
    try {
      setSyncing(true);
      const property = await fetchProperty({
        id,
      });
      if (!property?.id) return;
      const local = await getLocalProperty(id);
      if (compareDates({ server: [property], local })) return;
      await syncProperties({
        update: [property],
        batchSize: BATCH_SIZE,
      });
      listingStore.updateListing({
        title: property.title,
        description: property?.description || "",
        duration: property?.duration,
        purpose: property?.purpose,
        category: property?.category.name,
        bedroom: property?.bedroom,
        bathroom: property?.bathroom,
        bedType: property?.bedType,
        guests: property?.guests,
        landarea: property?.landarea?.toString(),
        plots: property?.plots,
        viewType: property?.viewType,
        discount: property?.discount,
        caution_fee: property?.caution_fee,
        owner_type: property?.ownership?.owner_type || undefined,
        listing_role: property?.ownership?.listing_role || undefined,
        subCategory: property?.subcategory.name,
        companies: property?.companies,
        // ownershipDocuments: property?.ownership?.documents?.map((d) => ({
        //   media_type: d.document_type?.toUpperCase() as Media["media_type"],
        //   id: d.id,
        //   url: d.file_url,
        // })),
        price: property.price.toString(),
        photos: property?.media?.filter((img) => img.media_type == "IMAGE"),
        videos: property?.media?.filter((img) => img.media_type == "VIDEO"),
        availabilityPeriod: property?.availabilities?.map((a) => ({
          start: a.start,
          end: a.end,
        })),
        facilities: property?.amenities?.map((f) => f.name),
        address: {
          displayName: property.address.display_address,
          addressComponents: {
            country: property.address.country,
            state: property.address.state,
            city: property.address.city,
            street: property.address.street,
          },
          location: {
            latitude: property.address.latitude,
            longitude: property.address.longitude,
          },
        },
      });
      await viewProperty({ id: property.id });
    } finally {
      setSyncing(false);
    }
  }, [id, syncing]);
  useEffect(() => {
    if (isInternetReachable) {
      resync();
    }
  }, [isInternetReachable]);
  useEffect(() => {
    if (!auto || hasAutoSynced.current) return;

    hasAutoSynced.current = true;
    resync();
  }, [auto, id]);
  return {
    syncing,
    resync,
  };
}
