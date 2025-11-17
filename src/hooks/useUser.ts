import { useStore } from "@/store";
import { useMemo } from "react";

export function useUser() {
  const { me, hasAuth: auth } = useStore((s) => s);
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
  }, [me]);
  const isAgent = useMemo(() => {
    if (me?.role == "agent" || me?.role == "staff_agent") {
      return true;
    } else {
      return false;
    }
  }, [me]);
  const isStaff = useMemo(() => {
    if (me?.role == "staff") {
      return true;
    } else {
      return false;
    }
  }, [me]);
  const hasAuth = useMemo(() => {
    if (me?.role == "user" || auth) {
      return true;
    } else {
      return false;
    }
  }, [me]);
  return { isAdmin, isAgent, isStaff, hasAuth, me };
}
