import { db } from "@/db";
import { writeDb } from "@/hooks/useLiveQuery";
import { sql } from "drizzle-orm";

export async function likePropertyById({ propertyId }: { propertyId: string }) {
  await writeDb(async () => {
    try {
      await db.run(
        sql`
    UPDATE properties
    SET
      liked = CASE
        WHEN liked = 1 THEN 0
        ELSE 1
      END,
      likes = CASE
        WHEN liked = 1 THEN likes - 1
        ELSE likes + 1
      END,
        dirty = 1,
        synced_at = NULL 
    WHERE
      id = ${propertyId}
      AND status = 'approved'
      AND deleted_at IS NULL
  `
      );
    } catch (e) {
      console.error("SYNC FAILED:", e);
      throw e;
    }
  });
}
