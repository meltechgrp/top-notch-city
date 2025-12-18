import { db } from "@/db";
import { properties, propertyListItems } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export function getList(listId: string, limit = 10) {
  return db
    .select()
    .from(propertyListItems)
    .innerJoin(properties, eq(properties.id, propertyListItems.propertyId))
    .where(
      and(eq(propertyListItems.listId, listId), isNull(properties.deletedAt))
    )
    .orderBy(propertyListItems.position)
    .limit(limit);
}
