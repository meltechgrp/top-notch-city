import { propertiesCollection } from "@/db/collections";
import { database } from "@/db";

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
  }));
}

export function getOutdatedIds({
  server,
  local,
}: {
  server: any[];
  local: { id: string; updated_at: number }[];
}) {
  const localMap = new Map(local.map((l) => [l.id, l.updated_at]));

  return server.filter((s) => {
    const localUpdated = localMap.get(s.id);
    if (!localUpdated) return true;
    return Date.parse(s.updated_at) > localUpdated;
  });
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
