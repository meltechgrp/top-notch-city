import { useMainStore } from "@/store";

export function useMe() {
  const user = useMainStore((state) => {
    const userId = state.activeUserId;
    if (!userId) return null;
    return state.accounts?.[userId]?.user ?? null;
  }) as Account | null;

  return {
    me: user as Account,
    isLoading: false,
    isLoggedIn: !!user,
    isAgent: user?.role == "agent" || user?.role == "staff_agent",
    isAdmin: user?.role == "admin" || user?.is_superuser || false,
  };
}
