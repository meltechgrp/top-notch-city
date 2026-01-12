import { database } from "@/db";
import {
  propertiesCollection,
  propertyMediaCollection,
  propertyAmenityCollection,
  propertyAvailabilityCollection,
  propertyOwnershipCollection,
  propertyCompaniesCollection,
  userCollection,
} from "@/db/collections";
import { chunkArray } from "@/db/helpers";
import { normalizeProperty } from "@/db/normalizers/property";
import { Q } from "@nozbe/watermelondb";

type SyncInput = {
  create?: any[];
  update?: any[];
  delete?: any[];
  batchSize?: number;
};
export async function syncProperties({
  create = [],
  update = [],
  delete: toDelete = [],
  batchSize = 5,
}: SyncInput) {
  console.log(
    `🧩 create=${create.length}, update=${update.length}, delete=${toDelete.length}`
  );

  if (toDelete.length) {
    const deleteIds = toDelete.map((p) => p.id);

    const collections = [
      propertiesCollection,
      propertyMediaCollection,
      propertyAmenityCollection,
      propertyAvailabilityCollection,
      propertyOwnershipCollection,
      propertyCompaniesCollection,
    ];

    const deletions = await Promise.all(
      collections.map((c) =>
        c.query(Q.where("property_server_id", Q.oneOf(deleteIds))).fetch()
      )
    );

    await database.write(async () => {
      await database.batch(
        ...deletions.flat().map((m: any) => m.prepareDestroyPermanently())
      );
    });
  }

  const toUpsert = [...create, ...update];
  if (!toUpsert.length) return;

  const batches = chunkArray(toUpsert, batchSize);

  for (let i = 0; i < batches.length; i++) {
    const rawBatch = batches[i];

    console.log(
      `🔄 Syncing batch ${i + 1}/${batches.length} (${rawBatch.length})`
    );

    const normalized = rawBatch.map(normalizeProperty).filter(Boolean) as any[];

    const propertyIds = normalized.map((n) => n.property.property_server_id);

    const ownerIds = normalized
      .map((n) => n.owner?.server_user_id)
      .filter(Boolean);

    /* -------- Pre-fetch existing records -------- */
    const [
      existingProperties,
      existingOwners,
      medias,
      amenities,
      availabilities,
      ownerships,
      companies,
    ] = await Promise.all([
      propertiesCollection
        .query(Q.where("property_server_id", Q.oneOf(propertyIds)))
        .fetch(),
      userCollection
        .query(Q.where("server_user_id", Q.oneOf(ownerIds)))
        .fetch(),
      propertyMediaCollection
        .query(Q.where("property_server_id", Q.oneOf(propertyIds)))
        .fetch(),
      propertyAmenityCollection
        .query(Q.where("property_server_id", Q.oneOf(propertyIds)))
        .fetch(),
      propertyAvailabilityCollection
        .query(Q.where("property_server_id", Q.oneOf(propertyIds)))
        .fetch(),
      propertyOwnershipCollection
        .query(Q.where("property_server_id", Q.oneOf(propertyIds)))
        .fetch(),
      propertyCompaniesCollection
        .query(Q.where("property_server_id", Q.oneOf(propertyIds)))
        .fetch(),
    ]);

    /* -------- Build lookup maps -------- */
    const propertyMap = new Map(
      existingProperties.map((p) => [p.property_server_id, p])
    );

    const ownerMap = new Map(existingOwners.map((u) => [u.server_user_id, u]));

    const clearMap = (rows: any[], key: string) => {
      const map = new Map<string, any[]>();
      for (const r of rows) {
        const id = r[key];
        if (!map.has(id)) map.set(id, []);
        map.get(id)!.push(r);
      }
      return map;
    };

    const mediaMap = clearMap(medias, "property_server_id");
    const amenityMap = clearMap(amenities, "property_server_id");
    const availabilityMap = clearMap(availabilities, "property_server_id");
    const ownershipMap = clearMap(ownerships, "property_server_id");
    const companyMap = clearMap(companies, "property_server_id");

    /* ---------------- WRITE ---------------- */
    await database.write(async () => {
      const ops: any[] = [];

      const preparedProperties = new Set<string>();
      const preparedOwners = new Set<string>();

      for (const n of normalized) {
        const propertyId = n.property.property_server_id;

        /* ---- PROPERTY ---- */
        const existing = propertyMap.get(propertyId);

        if (!preparedProperties.has(propertyId)) {
          preparedProperties.add(propertyId);

          if (existing) {
            ops.push(
              existing.prepareUpdate((p) => Object.assign(p, n.property))
            );
          } else {
            ops.push(
              propertiesCollection.prepareCreate((p) =>
                Object.assign(p, n.property)
              )
            );
          }

          /* ---- CLEAR RELATIONS ---- */
          [
            mediaMap,
            amenityMap,
            availabilityMap,
            ownershipMap,
            companyMap,
          ].forEach((map) => {
            map
              .get(propertyId)
              ?.forEach((m: any) => ops.push(m.prepareDestroyPermanently()));
          });
        }

        /* ---- RELATIONS ---- */
        n.media?.forEach((m: any) =>
          ops.push(
            propertyMediaCollection.prepareCreate((pm) => Object.assign(pm, m))
          )
        );

        n.amenities?.forEach((a: any) =>
          ops.push(
            propertyAmenityCollection.prepareCreate((pa) =>
              Object.assign(pa, a)
            )
          )
        );

        n.availabilities?.forEach((av: any) =>
          ops.push(
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

        n.companies?.forEach((c: any) =>
          ops.push(
            propertyCompaniesCollection.prepareCreate((pc) =>
              Object.assign(pc, c)
            )
          )
        );

        /* ---- OWNER ---- */
        if (n.owner) {
          const id = n.owner.server_user_id;
          const existingOwner = ownerMap.get(id);

          if (!preparedOwners.has(id)) {
            preparedOwners.add(id);

            if (existingOwner) {
              ops.push(
                existingOwner.prepareUpdate((u) => {
                  u.status = n.owner.status;
                  u.profile_image = n.owner.profile_image;
                })
              );
            } else {
              ops.push(
                userCollection.prepareCreate((u) => Object.assign(u, n.owner))
              );
            }
          }
        }
      }

      await database.batch(...ops);
    });
  }

  console.log("✅ Property sync completed");
}
