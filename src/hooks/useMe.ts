// hooks/useMe.ts
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { getMe } from "@/db/queries/user";
import { mapUserData } from "@/lib/utils";

export function useMe() {
  const { data, isLoading, error } = useLiveQuery(getMe);
  const me = data ? mapUserData(data) : null;
  return {
    me,
    isLoading,
    isLoggedIn: !!data,
    error,
    isAgent: me?.role == "agent" || me?.role == "staff_agent",
    isAdmin: me?.role == "admin" || me?.is_superuser || false,
  };
}
