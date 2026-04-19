import { useCallback, useEffect, useRef, useState } from "react";
import { syncProperties } from "@/db/sync/property";
import { fetchProperty, viewProperty } from "@/actions/property";
import { listingStore } from "@/store/listing";
import { compareDates, getLocalProperty } from "@/db/helpers";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const BATCH_SIZE = 10;

export async function syncPropertyById(
  id: string,
  {
    forceFreshUpdatedAt = false,
    property,
  }: {
    forceFreshUpdatedAt?: boolean;
    property?: ServerProperty | null;
  } = {},
) {
  const nextProperty = property ?? (await fetchProperty({ id }));
  if (!nextProperty?.id) return null;

  await syncProperties({
    update: [
      forceFreshUpdatedAt
        ? {
            ...nextProperty,
            updated_at: new Date().toISOString(),
          }
        : nextProperty,
    ],
    batchSize: BATCH_SIZE,
  });

  return nextProperty;
}

export function usePropertyDataSync(id: string, auto = true) {
  const [syncing, setSyncing] = useState(false);
  const { isInternetReachable } = useNetworkStatus();
  const hasAutoSynced = useRef(false);
  const resync = useCallback(async () => {
    if (syncing || !id) return;
    try {
      setSyncing(true);
      const property = await fetchProperty({ id });
      if (!property?.id) return;
      const local = await getLocalProperty(id);
      const localEntry = local?.[0];
      if (localEntry && !compareDates(localEntry, property)) return;
      await syncPropertyById(id, { property });
      listingStore.updateListing({
        owner_type: property?.ownership?.owner_type || undefined,
        listing_role: property?.ownership?.listing_role || undefined,
        companies: property?.companies,
        availabilityPeriod: property?.availabilities?.map((a) => ({
          start: a.start,
          end: a.end,
        })),
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
