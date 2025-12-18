import { db } from "@/db";
import {
  properties,
  addresses,
  interactions,
  ownerInteractions,
  media,
} from "@/db/schema";
import { eq, and, isNull, inArray, between } from "drizzle-orm";

export function getAgentList({
  agentId,
  limit = 10,
  page = 1,
}: {
  agentId: string;
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
    .innerJoin(addresses, eq(addresses.propertyId, properties.id))
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(and(eq(properties.ownerId, agentId), isNull(properties.deletedAt)))
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
    .innerJoin(addresses, eq(addresses.propertyId, properties.id))
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(
      and(
        isNull(properties.deletedAt),
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
    .innerJoin(addresses, eq(addresses.propertyId, properties.id))
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(and(eq(properties.isFeatured, true), isNull(properties.deletedAt)))
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
    .innerJoin(addresses, eq(addresses.propertyId, properties.id))
    .leftJoin(interactions, eq(interactions.propertyId, properties.id))
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .leftJoin(media, eq(media.propertyId, properties.id))
    .where(
      and(
        isNull(properties.deletedAt),
        between(addresses.latitude, minLat, maxLat),
        between(addresses.longitude, minLng, maxLng)
      )
    )
    .limit(limit)
    .offset(offset);
}
