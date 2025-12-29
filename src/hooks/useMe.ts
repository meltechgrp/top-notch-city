import { mainStore } from "@/store";
import { use$ } from "@legendapp/state/react";

export function useMe() {
  const user = use$(mainStore.activeAccount) as Account;
  return {
    me: user as Account,
    isLoading: false,
    isLoggedIn: !!user,
    isAgent: user?.role == "agent" || user?.role == "staff_agent",
    isAdmin: user?.role == "admin" || user?.is_superuser || false,
  };
}
