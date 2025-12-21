// sync/propertySync.ts
import { db } from "@/db";
import {
  properties,
  media,
  interactions,
  ownerInteractions,
  addresses,
  propertyAddresses,
  amenities,
  propertyAmenities,
  ownerships,
  owners,
  availabilities,
  companies,
  propertyCompanies,
  reviews,
} from "@/db/schema";
import { writeDb } from "@/hooks/useLiveQuery";

export async function syncPropertyLists(lists: any[]) {
  await writeDb(async () => {
    try {
      for (const list of lists) {
        await db.insert(properties).values(list.property).onConflictDoUpdate({
          target: properties.id,
          set: list.property,
        });
        for (const m of list.media) {
          await db
            .insert(media)
            .values(m)
            .onConflictDoUpdate({
              target: [media.propertyId, media.id],
              set: {
                url: m.url,
                mediaType: m.mediaType,
              },
            });
        }

        if (list.interaction) {
          await db
            .insert(interactions)
            .values(list.interaction)
            .onConflictDoUpdate({
              target: interactions.propertyId,
              set: list.interaction,
            });
        }

        for (const a of list.amenities) {
          await db.insert(amenities).values(a).onConflictDoNothing();
        }
        for (const pa of list.propertyAmenities) {
          await db.insert(propertyAmenities).values(pa).onConflictDoNothing();
        }
        if (list.ownerInteraction) {
          await db
            .insert(ownerInteractions)
            .values(list.ownerInteraction)
            .onConflictDoUpdate({
              target: ownerInteractions.propertyId,
              set: list.ownerInteraction,
            });
        }
        if (list.owner) {
          await db.insert(owners).values(list.owner).onConflictDoUpdate({
            target: owners.id,
            set: list.owner,
          });
        }
        if (list.ownership) {
          await db
            .insert(ownerships)
            .values(list.ownership)
            .onConflictDoUpdate({
              target: ownerships.ownerId,
              set: list.ownership,
            });
        }
        if (list.address) {
          await db.insert(addresses).values(list.address).onConflictDoUpdate({
            target: addresses.id,
            set: list.address,
          });

          await db
            .insert(propertyAddresses)
            .values({
              propertyId: list.property.id,
              addressId: list.address.id,
            })
            .onConflictDoNothing();
        }
        for (const aval of list.availabilities) {
          await db.insert(availabilities).values(aval).onConflictDoUpdate({
            target: availabilities.id,
            set: aval,
          });
        }
        for (const review of list.reviews) {
          await db.insert(reviews).values(review).onConflictDoUpdate({
            target: companies.id,
            set: review,
          });
        }
        for (const company of list.companies) {
          await db.insert(companies).values(company).onConflictDoUpdate({
            target: companies.id,
            set: company,
          });

          await db
            .insert(propertyCompanies)
            .values({
              propertyId: list.property.id,
              companyId: company.id,
            })
            .onConflictDoNothing();
        }
      }
    } catch (e) {
      console.error("SYNC FAILED:", e);
      throw e;
    }
  });
}
