import { database } from "@/db";
import {
  propertiesCollection,
  propertyMediaCollection,
  propertyAmenityCollection,
  propertyAvailabilityCollection,
  propertyOwnershipCollection,
  propertyCompaniesCollection,
  propertyOwnerCollection,
} from "@/db/collections";
import { chunkArray } from "@/db/helpers";
import { normalizeProperty } from "@/db/normalizers/property";
import { Q } from "@nozbe/watermelondb";

type SyncInput = {
  create: any[];
  update: { server: any; local: any }[];
  delete: any[];
  batchSize: number;
};

export async function syncProperties({
  create = [],
  update = [],
  delete: toDelete = [],
  batchSize,
}: SyncInput) {
  console.log(
    `🧩 create=${create.length}, update=${update.length}, delete=${toDelete.length}`
  );

  if (toDelete.length) {
    await database.write(async () => {
      const deletions = toDelete.flatMap((p) =>
        [
          propertiesCollection,
          propertyMediaCollection,
          propertyAmenityCollection,
          propertyAvailabilityCollection,
          propertyOwnershipCollection,
          propertyCompaniesCollection,
        ].flatMap(async (collection) =>
          (
            await collection.query(Q.where("property_server_id", p.id)).fetch()
          ).map((m: any) => m.prepareDestroyPermanently())
        )
      );

      await database.batch(...(await Promise.all(deletions)).flat());
    });
  }

  const toUpsert = [...create, ...update.map((u) => u.server)];
  if (!toUpsert.length) return;

  const batches = chunkArray(toUpsert, batchSize);

  for (let i = 0; i < batches.length; i++) {
    const batchItems = batches[i];

    console.log(
      `🔄 Syncing batch ${i + 1}/${batches.length} (${batchItems.length})`
    );

    await database.write(async () => {
      const ops: any[] = [];
      const updatedOwners = new Set<string>();

      for (const raw of batchItems) {
        const n = normalizeProperty(raw);
        if (!n) continue;

        const propertyId = n.property.property_server_id;

        const [existingProperty] = await propertiesCollection
          .query(Q.where("property_server_id", propertyId))
          .fetch();

        const propertyModel = existingProperty
          ? existingProperty.prepareUpdate((p) => Object.assign(p, n.property))
          : propertiesCollection.prepareCreate((p) =>
              Object.assign(p, n.property)
            );

        ops.push(propertyModel);

        const clearRelations = async (collection: any) =>
          (
            await collection
              .query(Q.where("property_server_id", propertyId))
              .fetch()
          ).map((m: any) => m.prepareDestroyPermanently());

        ops.push(
          ...(await clearRelations(propertyMediaCollection)),
          ...(await clearRelations(propertyAmenityCollection)),
          ...(await clearRelations(propertyAvailabilityCollection)),
          ...(await clearRelations(propertyOwnershipCollection)),
          ...(await clearRelations(propertyCompaniesCollection))
        );

        if (n.media)
          ops.push(
            ...n.media.map((m) =>
              propertyMediaCollection.prepareCreate((pm) =>
                Object.assign(pm, m)
              )
            )
          );

        if (n.amenities)
          ops.push(
            ...n.amenities.map((a) =>
              propertyAmenityCollection.prepareCreate((pa) =>
                Object.assign(pa, a)
              )
            )
          );

        if (n.availabilities)
          ops.push(
            ...n.availabilities.map((av) =>
              propertyAvailabilityCollection.prepareCreate((pa) =>
                Object.assign(pa, av)
              )
            )
          );

        if (n.ownership) {
          ops.push(
            propertyOwnershipCollection.prepareCreate((o) =>
              Object.assign(o, n.ownership)
            )
          );
        }

        if (n.owner) {
          const serverUserId = n.owner.server_user_id;

          const [existingOwner] = await propertyOwnerCollection
            .query(Q.where("server_user_id", serverUserId))
            .fetch();

          if (existingOwner) {
            if (!updatedOwners.has(existingOwner.id)) {
              updatedOwners.add(existingOwner.id);
              ops.push(
                existingOwner.prepareUpdate((u) => Object.assign(u, n.owner))
              );
            }
          } else {
            ops.push(
              propertyOwnerCollection.prepareCreate((u) =>
                Object.assign(u, n.owner)
              )
            );
          }
        }

        for (const company of n.companies || []) {
          ops.push(
            propertyCompaniesCollection.prepareCreate((c) =>
              Object.assign(c, company)
            )
          );
        }
      }

      await database.batch(...ops);
    });
  }

  console.log("✅ Property sync completed");
}
