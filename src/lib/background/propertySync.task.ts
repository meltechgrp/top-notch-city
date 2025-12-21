import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { PROPERTY_SYNC_TASK } from "@/constants";
import { runPropertyBackgroundSync } from "@/lib/background/runBackgroundSync";

TaskManager.defineTask(PROPERTY_SYNC_TASK, async () => {
  try {
    await runPropertyBackgroundSync();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.error("Background property sync failed", e);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
