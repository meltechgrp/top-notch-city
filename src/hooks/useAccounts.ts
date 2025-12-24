import { useCallback } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { syncUser } from "@/db/sync/users";
import { normalizeMe } from "@/db/normalizers/user";

import {
  getActiveAccount,
  removeActiveUser,
  removeToken,
  setActiveUserId,
  setToken,
} from "@/lib/secureStore";

import { useLiveQuery, writeDb } from "@/hooks/useLiveQuery";
import useResetAppState from "./useResetAppState";
import config from "@/config";
import { fullName } from "@/lib/utils";

export function useMultiAccount() {
  const resetAppState = useResetAppState();

  const handleInvalidAuth = useCallback(async () => {
    await resetAppState();
  }, [resetAppState]);
  const accountsQuery = useLiveQuery(() =>
    db.select().from(accounts).orderBy(accounts.lastLoginAt)
  );

  const updateAccount = useCallback(async () => {
    try {
      const active = await getActiveAccount();
      if (!active?.token || !active?.userId) {
        return handleInvalidAuth();
      }

      const resp = await fetch(`${config.origin}/api/users/${active.userId}`, {
        headers: {
          Authorization: `Bearer ${active.token}`,
        },
      });

      if (!resp.ok) {
        return handleInvalidAuth();
      }

      const me = await resp.json();
      if (!me || me?.detail) {
        return handleInvalidAuth();
      }

      await syncUser(normalizeMe(me));
    } catch {}
  }, [handleInvalidAuth]);

  const addAccount = useCallback(
    async ({ user, token }: { user: Me; token: string }) => {
      const now = new Date().toISOString();
      await writeDb(async () => {
        await resetAppState({ onlyCache: true });

        await db.transaction(async (tx) => {
          await tx
            .insert(users)
            .values({
              id: user.id,
              slug: user.slug,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              status: user.status,
              createdAt: user.created_at,
              updatedAt: user.updated_at,
            })
            .onConflictDoUpdate({
              target: users.id,
              set: {
                email: user.email,
                updatedAt: user.updated_at,
              },
            });

          await tx.update(accounts).set({ isActive: false });

          await tx
            .insert(accounts)
            .values({
              userId: user.id,
              email: user.email,
              role: user.role,
              isActive: true,
              lastLoginAt: now,
              fullName: fullName(user),
            })
            .onConflictDoUpdate({
              target: accounts.userId,
              set: {
                isActive: true,
                lastLoginAt: now,
              },
            });
        });

        await Promise.all([setActiveUserId(user.id), setToken(user.id, token)]);
      });
    },
    [resetAppState]
  );

  const switchToAccount = useCallback(async (userId: string) => {
    await writeDb(async () => {
      await db.transaction(async (tx) => {
        await tx.update(accounts).set({ isActive: false });
        await tx
          .update(accounts)
          .set({ isActive: true })
          .where(eq(accounts.userId, userId));
      });
    });

    await setActiveUserId(userId);
  }, []);

  const removeAccount = useCallback(async (userId: string) => {
    await writeDb(async () => {
      await db.delete(accounts).where(eq(accounts.userId, userId));
      await removeToken(userId);

      const [next] = await db.select().from(accounts).limit(1);

      if (next) {
        await setActiveUserId(next.userId);
      } else {
        await removeActiveUser();
      }
    });
  }, []);

  return {
    accounts: accountsQuery,
    addAccount,
    switchToAccount,
    removeAccount,
    updateAccount,
  };
}
