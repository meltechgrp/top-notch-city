// sync/propertySync.ts
import { db } from "@/db";
import {
  properties,
  categories,
  subcategories,
  addresses,
  media,
  amenities,
  propertyAmenities,
  interactions,
  ownerInteractions,
  propertyListItems,
  propertyLists,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeDb } from "@/hooks/useLiveQuery";
import { normalizeProperty } from "@/db/normalizers/property";

export async function syncProperties(listId: string, apiItems: any[]) {
  await writeDb(async () => {
    await db.transaction(async (tx) => {
      // clear list
      await tx
        .delete(propertyListItems)
        .where(eq(propertyListItems.listId, listId));

      for (const [index, api] of apiItems.entries()) {
        const n = normalizeProperty(api);

        await tx.insert(properties).values(n.property).onConflictDoUpdate({
          target: properties.id,
          set: n.property,
        });

        if (n.category) {
          await tx.insert(categories).values(n.category).onConflictDoNothing();
        }

        if (n.subcategory) {
          await tx
            .insert(subcategories)
            .values(n.subcategory)
            .onConflictDoNothing();
        }

        if (n.address) {
          await tx.insert(addresses).values(n.address).onConflictDoUpdate({
            target: addresses.propertyId,
            set: n.address,
          });
        }

        for (const m of n.media) {
          await tx.insert(media).values(m).onConflictDoUpdate({
            target: media.id,
            set: m,
          });
        }

        for (const a of n.amenities) {
          await tx.insert(amenities).values(a).onConflictDoNothing();
        }

        for (const pa of n.propertyAmenities) {
          await tx.insert(propertyAmenities).values(pa).onConflictDoNothing();
        }

        if (n.interaction) {
          await tx
            .insert(interactions)
            .values(n.interaction)
            .onConflictDoUpdate({
              target: interactions.propertyId,
              set: n.interaction,
            });
        }

        if (n.ownerInteraction) {
          await tx
            .insert(ownerInteractions)
            .values(n.ownerInteraction)
            .onConflictDoUpdate({
              target: ownerInteractions.propertyId,
              set: n.ownerInteraction,
            });
        }

        await tx
          .insert(propertyListItems)
          .values({
            listId,
            propertyId: n.property.id,
            position: index,
          })
          .onConflictDoUpdate({
            target: [propertyListItems.listId, propertyListItems.propertyId],
            set: { position: index },
          });
      }

      await tx
        .insert(propertyLists)
        .values({ id: listId, updatedAt: new Date().toISOString() })
        .onConflictDoUpdate({
          target: propertyLists.id,
          set: { updatedAt: new Date().toISOString() },
        });
    });
  });
}
