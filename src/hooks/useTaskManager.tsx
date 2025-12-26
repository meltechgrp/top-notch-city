import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { useEffect, useCallback } from "react";
import { useDbStore } from "@/store/dbStore";
import { shouldSync } from "@/hooks/useLiveQuery";
import { PROPERTY_SYNC_TASK } from "@/constants";

export function useBackgroundSync() {
  const { lastSync, update, load } = useDbStore();

  useEffect(() => {
    load();
  }, [load]);

  const syncNow = useCallback(async () => {
    if (!lastSync || shouldSync(lastSync)) {
      // await runPropertyBackgroundSync();
      update();
    }
  }, [lastSync, update]);

  useEffect(() => {
    if (lastSync !== undefined) {
      syncNow();
    }
  }, [lastSync, syncNow]);

  return {
    syncNow,
    enabled: shouldSync(lastSync),
  };
}

export async function registerPropertyBackgroundSync() {
  const available = await TaskManager.isAvailableAsync();
  if (!available) {
    console.log("❌ TaskManager not available");
    return;
  }

  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
    console.log("❌ Background tasks unavailable:", status);
    return;
  }

  const isRegistered =
    await TaskManager.isTaskRegisteredAsync(PROPERTY_SYNC_TASK);

  if (isRegistered) {
    console.log("ℹ️ Property sync already registered");
    return;
  }

  await BackgroundTask.registerTaskAsync(PROPERTY_SYNC_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
  });

  console.log("✅ Property background sync registered");
}
