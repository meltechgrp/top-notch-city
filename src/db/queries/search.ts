import { db } from "@/db";
import { properties } from "@/db/schema";
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
      between(properties.latitude, minLat, maxLat),
      between(properties.longitude, minLng, maxLng)
    );
  }
  return db
    .select()
    .from(properties)
    .where(and(...whereConditions))
    .limit(limit)
    .offset(offset);
}
