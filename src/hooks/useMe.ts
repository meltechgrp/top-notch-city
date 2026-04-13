import { mainStore } from "@/store";
import { useValue } from "@legendapp/state/react";

export function useMe() {
  const user = useValue(mainStore.activeAccount) as Account | null;
  return {
    me: user as Account,
    isLoading: false,
    isLoggedIn: !!user,
    isAgent: user?.role == "agent" || user?.role == "staff_agent",
    isAdmin: user?.role == "admin" || user?.is_superuser || false,
  };
}
