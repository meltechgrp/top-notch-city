import { db } from "@/db";
import {
  properties,
  addresses,
  interactions,
  ownerInteractions,
  media,
  propertyAddresses,
} from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export function getProperty({
  propertyId,
  isAdmin,
  isAgent,
}: {
  propertyId: string;
  isAdmin: boolean;
  isAgent: boolean;
}) {
  const whereConditions = [eq(properties.id, propertyId)];
  if (!isAdmin && !isAgent) {
    (isNull(properties.deletedAt),
      whereConditions.push(eq(properties.status, "approved")));
  }
  if (isAgent) {
    whereConditions.push(eq(properties.status, "deleted"));
  }
  return db
    .select({
      property: properties,
      interaction: interactions,
      ownerInteraction: ownerInteractions,
      media,
      address: addresses,
    })
    .from(properties)
    .leftJoin(interactions, eq(interactions.propertyId, properties.id))
    .innerJoin(
      propertyAddresses,
      eq(propertyAddresses.propertyId, properties.id)
    )
    .innerJoin(addresses, eq(addresses.id, propertyAddresses.addressId))
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(and(...whereConditions))
    .limit(1);
}
