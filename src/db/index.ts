// db/index.ts
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/db/migrations/migrations";

import {
  properties,
  media,
  amenities,
  propertyAmenities,
  interactions,
  ownerInteractions,
  addresses,
} from "@/db/schema";

export const expoSqlite = SQLite.openDatabaseSync("db.db");

export const db = drizzle(expoSqlite);

export async function runMigrations() {
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
    await tx.delete(media);
    await tx.delete(propertyAmenities);
    await tx.delete(amenities);
    await tx.delete(interactions);
    await tx.delete(ownerInteractions);
    await tx.delete(addresses);
    await tx.delete(properties);
  });
}
