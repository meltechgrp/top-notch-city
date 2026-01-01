import {
  propertiesCollection,
  propertyMediaCollection,
} from "@/db/collections";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

export async function resetDatabase() {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
}

export async function getLocalPropertyIndex() {
  const props = await propertiesCollection.query().fetch();

  return props.map((p) => ({
    id: p.property_server_id,
    updated_at: p.updated_at,
    status: p.status,
  })) as any[];
}
export async function getLocalProperty(slug: string) {
  const props = await propertiesCollection
    .query(Q.where("slug", slug), Q.take(1))
    .fetch();

  return props.map((p) => ({
    id: p.property_server_id,
    updated_at: p.updated_at,
    status: p.status,
  })) as any[];
}

export function compareDates({ server, local }: { server: any; local: any }) {
  const localUpdated = local?.id == server?.id ? local?.updated_at : undefined;
  if (!localUpdated) return false;
  return Date.parse(server?.updated_at) != localUpdated;
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
export function diffServerAndLocal({
  server,
  local,
  serverIdKey,
  localIdKey,
  shouldDelete,
  shouldUpdate,
  mode,
}: {
  server: any[];
  local: any[];
  serverIdKey: string;
  localIdKey: string;
  shouldDelete: Function;
  shouldUpdate: Function;
  mode: "full" | "incremental";
}) {
  const serverMap = new Map(server.map((s) => [s[serverIdKey], s]));

  const toCreate = [];
  const toUpdate = [];
  const toDelete = [];

  for (const s of server) {
    const localItem = local.find((l) => l[localIdKey] === s[serverIdKey]);

    if (!localItem) {
      toCreate.push(s);
    } else if (shouldUpdate(localItem, s)) {
      toUpdate.push(s);
    }
  }

  // ❗ Only allow delete on FULL sync
  if (mode === "full") {
    for (const l of local) {
      if (shouldDelete(l, serverMap)) {
        toDelete.push(l);
      }
    }
  }

  return { toCreate, toUpdate, toDelete };
}

export function getPropertyDeleteRule(role: "user" | "agent" | "admin") {
  return (local: Property, serverMap: Map<string, any>) => {
    const serverProp = serverMap.get(local.id);

    if (!serverProp) return true;

    if (role === "user") {
      return serverProp.status !== "approved";
    }

    if (role === "agent") {
      return !!serverProp.is_deleted;
    }
    return false;
  };
}

export async function fetchIncremental<T>(
  fetcher: (
    page: number,
    perPage: number,
    updatedAfter: number
  ) => Promise<{
    results: T[];
    pages: number;
  }>,
  {
    updatedAfter,
    perPage = 100,
    maxItems = 500,
  }: {
    updatedAfter: number;
    perPage?: number;
    maxItems?: number;
  }
) {
  let page = 1;
  let pages = 1;
  const results: T[] = [];

  while (page <= pages && results.length < maxItems) {
    const res = await fetcher(page, perPage, updatedAfter);

    pages = res.pages;
    results.push(...res.results);
    page++;
  }

  return results.slice(0, maxItems);
}
