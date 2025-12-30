import { syncProperties } from "@/db/sync/property";
import { searchProperties } from "@/actions/search";
import {
  chunkArray,
  getLocalPropertyIndex,
  getOutdatedIds,
  resetDatabase,
} from "@/db/helpers";

const BATCH_SIZE = 10;

export async function syncPropertyFeed() {
  // await resetDatabase();
  const res = await searchProperties(1, 100, {
    country: "Nigeria",
    useGeoLocation: false,
  });

  const serverProps = res.results;
  const localIndex = await getLocalPropertyIndex();
  const toSync = getOutdatedIds({
    server: serverProps,
    local: localIndex,
  });
  console.log(
    toSync?.length,
    `properties to sync out of ${localIndex?.length} / ${serverProps?.length}`
  );
  if (toSync.length === 0) return;

  const batches = chunkArray(toSync, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    console.log(
      `🔄 Syncing batch ${i + 1}/${batches.length} (${batch.length} properties)`
    );
    await syncProperties(batch);
  }

  console.log("✅ Property feed sync completed");
}
