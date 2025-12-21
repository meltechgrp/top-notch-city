import { searchProperties } from "@/actions/search";
import { getLocalPropertyIndex } from "@/db/queries/property-list";
import { getOutdatedIds } from "@/lib/utils";
import { fetchProperty } from "@/actions/property";
import { normalizePropertyList } from "@/db/normalizers/property";
import { syncPropertyLists } from "@/db/sync/properties";
import { getAgents } from "@/actions/agent";
import { getUser } from "@/actions/user";
import { normalizeMe } from "@/db/normalizers/user";
import { syncUser } from "@/db/sync/users";

export async function runPropertyBackgroundSync(): Promise<boolean> {
  const res = await searchProperties(1, 100, {
    country: "Nigeria",
    useGeoLocation: false,
  });

  const serverIndex = res.results.map((p) => ({
    id: p.id,
    updatedAt: p.updated_at ?? p.created_at,
  }));

  const localIndex = await getLocalPropertyIndex();

  const idsToSync = getOutdatedIds({
    server: serverIndex,
    local: localIndex as any,
  });
  console.log(idsToSync?.length, "number to sync props");
  if (idsToSync.length === 0) return false;

  for (const id of idsToSync) {
    const property = await fetchProperty({ id });
    const data = normalizePropertyList(property);
    console.log(id, "property sync");
    await syncPropertyLists([data]);
  }

  return true;
}
export async function runAgentsBackgroundSync(): Promise<boolean> {
  const res = await getAgents({
    pageParam: 1,
  });

  const serverIndex = res.results.map((p) => p.id);

  // const localIndex = await getLocalPropertyIndex();

  // const idsToSync = getOutdatedIds({
  //   server: serverIndex,
  //   local: localIndex as any,
  // });
  console.log(serverIndex?.length, "number to sync agents");
  if (serverIndex.length === 0) return false;

  for (const id of serverIndex) {
    const user = await getUser(id);
    const data = normalizeMe(user);
    await syncUser(data);
  }

  return true;
}
