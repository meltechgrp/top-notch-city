// hooks/useMe.ts

import { accountStore } from "@/store/userStore";

export function useMe() {
  const data = accountStore.activeAccount.get();
  const user = data ? data : null;
  return {
    me: user as Account,
    isLoading: false,
    isLoggedIn: !!user,
    isAgent: user?.role == "agent" || user?.role == "staff_agent",
    isAdmin: user?.role == "admin" || user?.is_superuser || false,
  };
}
