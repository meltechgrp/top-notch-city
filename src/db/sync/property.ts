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
import { normalizeProperty } from "@/db/normalizers/property";
import { Q } from "@nozbe/watermelondb";

export async function syncProperties(serverProperties: any[]) {
  try {
    const updatedUsers = new Set<string>();

    await database.write(async () => {
      const batch: any[] = [];

      for (const raw of serverProperties) {
        const n = normalizeProperty(raw);
        if (n == null) continue;
        const propertyId = n.property.property_server_id;
        const existing = await propertiesCollection
          .query(Q.where("property_server_id", propertyId))
          .fetch();

        let propertyModel;

        if (existing.length > 0) {
          propertyModel = existing[0].prepareUpdate((p) => {
            Object.assign(p, n.property);
          });
        } else {
          propertyModel = propertiesCollection.prepareCreate((p) => {
            Object.assign(p, n.property);
          });
        }

        batch.push(propertyModel);

        const destroyByPropertyId = async (collection: any) =>
          (
            await collection
              .query(Q.where("property_server_id", propertyId))
              .fetch()
          ).map((m: any) => m.prepareDestroyPermanently());

        batch.push(
          ...(await destroyByPropertyId(propertyMediaCollection)),
          ...(await destroyByPropertyId(propertyAmenityCollection)),
          ...(await destroyByPropertyId(propertyAvailabilityCollection)),
          ...(await destroyByPropertyId(propertyOwnershipCollection)),
          ...(await destroyByPropertyId(propertyCompaniesCollection))
        );

        if (n.media) {
          batch.push(
            ...n.media.map((m) =>
              propertyMediaCollection.prepareCreate((pm) =>
                Object.assign(pm, m)
              )
            )
          );
        }

        if (n.amenities) {
          batch.push(
            ...n.amenities.map((a) =>
              propertyAmenityCollection.prepareCreate((pa) =>
                Object.assign(pa, a)
              )
            )
          );
        }

        if (n.availabilities) {
          batch.push(
            ...n.availabilities.map((av) =>
              propertyAvailabilityCollection.prepareCreate((pa) =>
                Object.assign(pa, av)
              )
            )
          );
        }

        if (n.ownership) {
          batch.push(
            propertyOwnershipCollection.prepareCreate((o) =>
              Object.assign(o, n.ownership)
            )
          );
        }

        if (n.owner) {
          const serverUserId = n.owner.server_user_id;

          const existingUser = await propertyOwnerCollection
            .query(Q.where("server_user_id", serverUserId))
            .fetch();

          if (existingUser.length > 0) {
            const user = existingUser[0];

            if (!updatedUsers.has(user.id)) {
              updatedUsers.add(user.id);

              batch.push(
                user.prepareUpdate((u) => {
                  Object.assign(u, n.owner);
                })
              );
            }
          } else {
            batch.push(
              propertyOwnerCollection.prepareCreate((u) => {
                Object.assign(u, n.owner);
              })
            );
          }
        }

        for (const company of n.companies || []) {
          batch.push(
            propertyCompaniesCollection.prepareCreate((c) =>
              Object.assign(c, {
                ...company,
              })
            )
          );
        }
      }

      await database.batch(...batch);
    });
  } catch (error) {
    console.log(error);
  }
}
