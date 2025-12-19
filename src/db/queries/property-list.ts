import { db } from "@/db";
import {
  properties,
  addresses,
  interactions,
  ownerInteractions,
  media,
  propertyAddresses,
} from "@/db/schema";
import { eq, and, isNull, inArray, between } from "drizzle-orm";

export function getAgentList({
  agentId,
  isOwner = false,
  limit = 10,
  page = 1,
}: {
  agentId: string;
  isOwner: boolean;
  limit?: number;
  page?: number;
}) {
  const offset = (page - 1) * limit;
  const whereConditions = [
    isNull(properties.deletedAt),
    eq(properties.ownerId, agentId),
  ];
  if (!isOwner) {
    whereConditions.push(eq(properties.status, "approved"));
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
    .limit(limit)
    .offset(offset);
}

export function getCategories({
  categories,
  limit = 10,
  page = 1,
}: {
  categories: string[];
  limit?: number;
  page?: number;
}) {
  const offset = (page - 1) * limit;

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
    .where(
      and(
        isNull(properties.deletedAt),
        eq(properties.status, "approved"),
        inArray(properties.category, categories)
      )
    )
    .limit(limit)
    .offset(offset);
}

export function getFeatured({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) {
  const offset = (page - 1) * limit;

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
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .innerJoin(
      propertyAddresses,
      eq(propertyAddresses.propertyId, properties.id)
    )
    .innerJoin(addresses, eq(addresses.id, propertyAddresses.addressId))
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(
      and(
        eq(properties.isFeatured, true),
        eq(properties.status, "approved"),
        isNull(properties.deletedAt)
      )
    )
    .limit(limit)
    .offset(offset);
}
export function getNearby({
  lat,
  long,
  radiusKm = 20,
  limit = 10,
  page = 1,
}: {
  lat: number;
  long: number;
  radiusKm?: number;
  limit?: number;
  page?: number;
}) {
  const offset = (page - 1) * limit;

  const delta = radiusKm / 111;

  const minLat = lat - delta;
  const maxLat = lat + delta;
  const minLng = long - delta;
  const maxLng = long + delta;

  return db
    .select({
      property: properties,
      interaction: interactions,
      ownerInteraction: ownerInteractions,
      media,
      address: addresses,
    })
    .from(properties)
    .innerJoin(
      propertyAddresses,
      eq(propertyAddresses.propertyId, properties.id)
    )
    .innerJoin(addresses, eq(addresses.id, propertyAddresses.addressId))
    .leftJoin(interactions, eq(interactions.propertyId, properties.id))
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(
      and(
        isNull(properties.deletedAt),
        eq(properties.status, "approved"),
        between(addresses.latitude, minLat, maxLat),
        between(addresses.longitude, minLng, maxLng)
      )
    )
    .limit(limit)
    .offset(offset);
}
