// db/queries/me.ts
import { db } from "@/db";
import {
  users,
  accounts,
  agentProfiles,
  addresses,
  userAddresses,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getMe() {
  const rows = await db
    .select({
      user: users,
      agent: agentProfiles,
      address: addresses,
    })
    .from(accounts)
    .innerJoin(users, eq(users.id, accounts.userId))
    .leftJoin(agentProfiles, eq(agentProfiles.userId, users.id))
    .leftJoin(userAddresses, eq(userAddresses.userId, users.id))
    .leftJoin(addresses, eq(addresses.id, userAddresses.addressId))
    .where(eq(accounts.isActive, true))
    .limit(1);

  return rows[0] ?? null;
}
