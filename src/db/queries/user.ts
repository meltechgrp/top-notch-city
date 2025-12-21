import { db } from "@/db";
import {
  users,
  agentProfiles,
  addresses,
  userAddresses,
  agentCompanies,
  companies,
  reviews,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getActiveUserId } from "@/lib/secureStore";
import { mapUserData } from "@/lib/utils";

export async function getMe(userId?: string) {
  const whereConditions = [];
  if (userId) {
    whereConditions.push(eq(users.id, userId));
  } else {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return null;
    whereConditions.push(eq(users.id, activeUserId));
  }
  const rows = await db
    .select({
      user: users,
      agent: agentProfiles,
      address: addresses,
      company: companies,
      review: reviews,
    })
    .from(users)
    .leftJoin(agentProfiles, eq(agentProfiles.userId, users.id))
    .leftJoin(userAddresses, eq(userAddresses.userId, users.id))
    .leftJoin(addresses, eq(addresses.id, userAddresses.addressId))
    .leftJoin(agentCompanies, eq(agentCompanies.agentId, users.id))
    .leftJoin(companies, eq(companies.id, agentCompanies.companyId))
    .leftJoin(reviews, eq(reviews.targetId, users.id))
    .where(and(...whereConditions));

  return rows.length ? mapUserData(rows) : null;
}

export async function getLocalUserIndex() {
  return db
    .select({
      id: users.id,
      updatedAt: users.updatedAt,
    })
    .from(users);
}
