import { useMemo } from "react";

interface Props {
  me: StoredAccount | undefined;
}

export function useUser({ me }: Props) {
  if (!me) {
    return {
      isAdmin: false,
      isAgent: false,
      isStaff: false,
      hasAuth: false,
      me: null,
    };
  }
  const isAdmin = useMemo(() => {
    if (me?.role == "admin" || me.is_superuser) {
      return true;
    } else {
      return false;
    }
  }, [me?.role]);
  const isAgent = useMemo(() => {
    if (me?.role == "agent" || me?.role == "staff_agent") {
      return true;
    } else {
      return false;
    }
  }, [me?.role]);
  const isStaff = useMemo(() => {
    if (me?.role == "staff") {
      return true;
    } else {
      return false;
    }
  }, [me?.role]);
  return { isAdmin, isAgent, isStaff, me };
}
