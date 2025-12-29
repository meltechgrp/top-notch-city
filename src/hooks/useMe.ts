import { useValue } from "@legendapp/state/react";

import { accountStore } from "@/store/userStore";

export function useMe() {
  const data = useValue(accountStore.activeAccount);
  const user = data ? data : null;
  return {
    me: user as Account,
    isLoading: false,
    isLoggedIn: !!user,
    isAgent: user?.role == "agent" || user?.role == "staff_agent",
    isAdmin: user?.role == "admin" || user?.is_superuser || false,
  };
}
