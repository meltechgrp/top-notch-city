import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useStore, useTempStore } from "@/store";
import { useChatStore } from "@/store/chatStore";
import {
  removeToken,
  removeActiveUser,
  getActiveUserId,
} from "@/lib/secureStore";

import { cacheStorage } from "@/lib/asyncStorage";

export default function useResetAppState() {
  const queryClient = useQueryClient();

  const resetAppState = useCallback(
    async (options?: {
      logoutAll?: boolean;
      onlyCache?: boolean;
      withStore?: boolean;
    }) => {
      if (options?.logoutAll) {
        // await clearAllAccounts();
      } else if (!options?.onlyCache) {
        const activeId = await getActiveUserId();
        if (activeId) {
          await removeToken(activeId);
          await removeActiveUser();
        }
      }
      if (!options?.withStore) {
        useStore.getState().resetStore();
      }
      useChatStore.getState().resetChatStore();
      useTempStore.getState().resetStore();

      await queryClient.cancelQueries();
      queryClient.clear();

      await cacheStorage.reset();
    },
    [queryClient]
  );

  return resetAppState;
}
