import { db } from "@/db";
import {
  addresses,
  users,
  agentProfiles,
  companies,
  agentCompanies,
  userAddresses,
} from "@/db/schema";
import { writeDb } from "@/hooks/useLiveQuery";

export async function syncUser(user: any) {
  await writeDb(async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.insert(users).values(user.user).onConflictDoUpdate({
          target: users.id,
          set: user.user,
        });

        if (user?.agentProfile) {
          await tx
            .insert(agentProfiles)
            .values(user.agentProfile)
            .onConflictDoUpdate({
              target: user.agentProfiles.userId,
              set: user.agentProfile,
            });
        }

        for (const company of user.companies) {
          await tx.insert(companies).values(company).onConflictDoUpdate({
            target: companies.id,
            set: company,
          });

          await tx.insert(agentCompanies).values({
            agentId: user.id,
            companyId: company.id,
          });
        }

        if (user.address) {
          await tx.insert(addresses).values(user.address);
          await tx
            .insert(userAddresses)
            .values({ userId: user.user.id, addressId: user.address.id });
        }
      });
    } catch (e) {
      console.error("User SYNC FAILED:", e);
      throw e;
    }
  });
}
