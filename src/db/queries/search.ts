import { db } from "@/db";
import {
  properties,
  addresses,
  interactions,
  ownerInteractions,
  media,
  propertyAddresses,
} from "@/db/schema";
import { eq, and, isNull, inArray, between, gte, lte } from "drizzle-orm";

export function getSearchList({
  filter,
  radiusKm = 40,
  limit = 10,
  page = 1,
}: {
  filter: SearchFilters;
  radiusKm?: number;
  limit?: number;
  page?: number;
}) {
  const offset = (page - 1) * limit;

  const whereConditions = [
    isNull(properties.deletedAt),
    eq(properties.status, "approved"),
  ];

  if (filter.purpose) {
    whereConditions.push(eq(properties.purpose, filter.purpose));
  }

  if (filter.category) {
    whereConditions.push(eq(properties.category, filter.category));
  }

  if (filter.subCategory?.length) {
    whereConditions.push(inArray(properties.subCategory, filter.subCategory));
  }

  if (filter.city) {
    whereConditions.push(eq(addresses.city, filter.city));
  }

  if (filter.state) {
    whereConditions.push(eq(addresses.state, filter.state));
  }

  if (filter.country) {
    whereConditions.push(eq(addresses.country, filter.country));
  }

  if (filter.minPrice !== undefined) {
    whereConditions.push(gte(properties.price, Number(filter.minPrice)));
  }

  if (filter.maxPrice !== undefined) {
    whereConditions.push(lte(properties.price, Number(filter.maxPrice)));
  }

  if (filter.latitude !== undefined && filter.longitude !== undefined) {
    const delta = radiusKm / 111;

    const minLat = filter.latitude - delta;
    const maxLat = filter.latitude + delta;
    const minLng = filter.longitude - delta;
    const maxLng = filter.longitude + delta;

    whereConditions.push(
      between(addresses.latitude, minLat, maxLat),
      between(addresses.longitude, minLng, maxLng)
    );
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
    .where(and(...whereConditions))
    .limit(limit)
    .offset(offset);
}
