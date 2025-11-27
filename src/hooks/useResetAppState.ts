import { storage } from "@/lib/asyncStorage";
import { removeAuthToken } from "@/lib/secureStore";
import { useStore, useTempStore } from "@/store";
import { useChatStore } from "@/store/chatStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export default function useResetAppState() {
  const queryClient = useQueryClient();
  const resetAppState = useCallback(async () => {
    removeAuthToken();
    storage.clearAll();
    useStore.getState().resetStore();
    useChatStore.getState().resetChatStore();
    useTempStore.getState().resetStore();
    queryClient.removeQueries();
    queryClient.clear();
  }, []);

  return resetAppState;
}
