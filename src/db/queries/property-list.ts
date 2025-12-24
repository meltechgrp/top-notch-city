import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq, and, isNull, inArray, between } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

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

  const { data } = useLiveQuery(
    db
      .select()
      .from(properties)
      .where(
        and(
          inArray(properties.category, categories),
          eq(properties.status, "approved"),
          isNull(properties.deletedAt)
        )
      )
      .limit(limit)
      .offset(offset)
  );
  return data as PropertyList[];
}

export function getFeatured({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) {
  const { data } = useLiveQuery(
    db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.isFeatured, true),
          eq(properties.status, "approved"),
          isNull(properties.deletedAt)
        )
      )
      .limit(limit)
  );
  return data as PropertyList[];
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
  const { data } = useLiveQuery(
    db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.status, "approved"),
          isNull(properties.deletedAt),
          between(properties.latitude, lat - delta, lat + delta),
          between(properties.longitude, long - delta, long + delta)
        )
      )
      .limit(limit)
      .offset(offset)
  );
  return data as PropertyList[];
}
export async function getLocalPropertyIndex() {
  return db
    .select({
      id: properties.id,
      updatedAt: properties.updatedAt,
    })
    .from(properties);
}
