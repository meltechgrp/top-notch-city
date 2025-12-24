// sync/propertySync.ts
import { db } from "@/db";
import { properties } from "@/db/schema";
import { writeDb } from "@/hooks/useLiveQuery";

export async function syncPropertyLists(lists: any[]) {
  await writeDb(async () => {
    try {
      for (const list of lists) {
        await db.insert(properties).values(list.property).onConflictDoUpdate({
          target: properties.id,
          set: list.property,
        });
      }
    } catch (e) {
      console.error("SYNC FAILED:", e);
      throw e;
    }
  });
}
