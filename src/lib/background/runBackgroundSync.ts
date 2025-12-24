import { searchProperties } from "@/actions/search";
import { getLocalPropertyIndex } from "@/db/queries/property-list";
import { getOutdatedIds } from "@/lib/utils";
import { normalizePropertyList } from "@/db/normalizers/property";
import { syncPropertyLists } from "@/db/sync/properties";

export async function runPropertyBackgroundSync(): Promise<boolean> {
  const res = await searchProperties(1, 100, {
    country: "Nigeria",
    useGeoLocation: false,
  });

  const serverProps = res.results;

  const localIndex = await getLocalPropertyIndex();

  const toSync = getOutdatedIds({
    server: serverProps,
    local: localIndex as any,
  });
  console.log(toSync?.length, "properties to sync");
  if (toSync.length === 0) return false;

  for (const property of toSync) {
    const data = normalizePropertyList(property);
    await syncPropertyLists([data]);
  }
  console.log("done syncing");
  return true;
}
