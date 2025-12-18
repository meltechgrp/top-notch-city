// db/index.ts
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/db/migrations/migrations";

import {
  properties,
  propertyListItems,
  propertyLists,
  media,
  amenities,
  propertyAmenities,
  interactions,
  ownerInteractions,
  addresses,
} from "@/db/schema";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const expo = SQLite.openDatabaseSync("db.db");

export const db = drizzle(expo);

export async function runMigrations() {
  useDrizzleStudio(expo);
  await clearAllData();
  try {
    await migrate(db, migrations);
    console.log("✅ Migrations ran successfully");
  } catch (e) {
    console.error("❌ Migration failed", e);
  }
}

export async function resetDatabase() {
  await SQLite.deleteDatabaseAsync("db.db");
}

export async function clearAllData() {
  await db.transaction(async (tx) => {
    await tx.delete(propertyListItems);
    await tx.delete(propertyLists);
    await tx.delete(media);
    await tx.delete(propertyAmenities);
    await tx.delete(amenities);
    await tx.delete(interactions);
    await tx.delete(ownerInteractions);
    await tx.delete(addresses);
    await tx.delete(properties);
  });
}
export async function clearListsOnly() {
  await db.delete(propertyListItems);
  await db.delete(propertyLists);
}
