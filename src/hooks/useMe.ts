// hooks/useMe.ts
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { getMe } from "@/db/queries/user";

export function useMe(userId?: string) {
  const { data, isLoading, error, refetch } = useLiveQuery(() => getMe(userId));
  return {
    me: data,
    isLoading,
    isLoggedIn: !!data,
    error,
    isAgent: data?.role == "agent" || data?.role == "staff_agent",
    isAdmin: data?.role == "admin" || data?.isSuperuser || false,
    refetch,
  };
}
