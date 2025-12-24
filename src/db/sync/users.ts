import { db } from "@/db";
import { users } from "@/db/schema";
import { writeDb } from "@/hooks/useLiveQuery";

export async function syncUser(user: any) {
  await writeDb(async () => {
    try {
      await db.insert(users).values(user.user).onConflictDoUpdate({
        target: users.id,
        set: user.user,
      });
    } catch (e) {
      console.error("User SYNC FAILED:", e);
      throw e;
    }
  });
}
