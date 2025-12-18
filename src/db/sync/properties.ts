// sync/propertySync.ts
import { db } from "@/db";
import {
  properties,
  media,
  interactions,
  ownerInteractions,
  addresses,
} from "@/db/schema";
import { writeDb } from "@/hooks/useLiveQuery";

export async function syncPropertyLists(lists: any[]) {
  await writeDb(async () => {
    try {
      await db.transaction(async (tx) => {
        for (const list of lists) {
          await tx.insert(properties).values(list.property).onConflictDoUpdate({
            target: properties.id,
            set: list.property,
          });

          for (const m of list.media) {
            await tx.insert(media).values(m).onConflictDoUpdate({
              target: media.id,
              set: m,
            });
          }

          if (list.interaction) {
            await tx
              .insert(interactions)
              .values(list.interaction)
              .onConflictDoUpdate({
                target: interactions.propertyId,
                set: list.interaction,
              });
          }

          if (list.ownerInteraction) {
            await tx
              .insert(ownerInteractions)
              .values(list.ownerInteraction)
              .onConflictDoUpdate({
                target: ownerInteractions.propertyId,
                set: list.ownerInteraction,
              });
          }
          if (list.address) {
            await tx.insert(addresses).values(list.address).onConflictDoUpdate({
              target: addresses.propertyId,
              set: list.address,
            });
          }
        }
      });
    } catch (e) {
      console.error("SYNC FAILED:", e);
      throw e;
    }
  });
}
