import { Fetch } from "@/actions/utills";
import { storage } from "@/lib/asyncStorage";
import { removeAuthToken } from "@/lib/secureStore";
import { useStore, useTempStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export default function useResetAppState(isDelete?: boolean) {
  const queryClient = useQueryClient();
  const resetAppState = useCallback(async () => {
    removeAuthToken();
    storage.clearAll();
    useStore.getState().resetStore();
    useTempStore.getState().resetStore();
    queryClient.clear();
    {
      !isDelete &&
        (await Fetch("/logout", {
          method: "POST",
        }));
    }
  }, []);

  return resetAppState;
}
