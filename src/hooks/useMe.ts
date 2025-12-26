// hooks/useMe.ts
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { getMe } from "@/db/queries/user";

export function useMe() {
  const { data, isLoading, error, refetch } = useLiveQuery(() => getMe());
  const user = data?.[0] ? data[0].user : null;
  return {
    me: user as Account,
    isLoading,
    isLoggedIn: !!user,
    error,
    isAgent: user?.role == "agent" || user?.role == "staff_agent",
    isAdmin: user?.role == "admin" || user?.is_superuser || false,
    refetch,
  };
}
