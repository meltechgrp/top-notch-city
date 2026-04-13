import { useCallback, useRef, useState } from "react";
import { syncProperties } from "@/db/sync/property";
import { searchProperties } from "@/actions/search";
import {
  fetchAdminProperties,
  fetchAgentProperties,
} from "@/actions/property/list";
import {
  compareDates,
  diffServerAndLocal,
  fetchIncremental,
  getLocalPropertyIndex,
  getPropertyDeleteRule,
} from "@/db/helpers";
import { useMe } from "@/hooks/useMe";
import { mainStore } from "@/store";

const BATCH_SIZE = 10;

let globalSyncing = false;

export function usePropertyFeedSync() {
  const { isAdmin, isAgent, me } = useMe();
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);

  const resync = useCallback(async () => {
    if (!me || syncingRef.current || globalSyncing) return;
    try {
      syncingRef.current = true;
      globalSyncing = true;
      setSyncing(true);
      console.log("starting property sync");

      const lastSyncAt = mainStore.propertyLastSyncAt.get() || 0;
      const isIncremental = Boolean(lastSyncAt);
      let serverProperties: any[] = [];

      if (isAdmin) {
        serverProperties = await fetchIncremental(
          (page, perPage, updatedAfter) =>
            fetchAdminProperties({
              pageParam: page,
              perPage,
              updated_after: updatedAfter,
            }),
          { updatedAfter: lastSyncAt }
        );
      } else {
        serverProperties = await fetchIncremental(
          (page, perPage, updatedAfter) =>
            searchProperties(
              page,
              perPage,
              {
                country: "Nigeria",
                useGeoLocation: false,
              },
              updatedAfter
            ),
          { updatedAfter: lastSyncAt }
        );

        if (isAgent) {
          const agentRes = await fetchIncremental(
            (page, perPage, updatedAfter) =>
              fetchAgentProperties({
                pageParam: page,
                perPage,
                updated_after: updatedAfter,
              }),
            { updatedAfter: lastSyncAt }
          );
          const map = new Map();
          [...serverProperties, ...agentRes].forEach((p) => map.set(p.id, p));
          serverProperties = [...map.values()];
        }
      }

      if (!serverProperties.length && isIncremental) {
        console.log("✅ Property sync: no new data from server");
        return;
      }

      const localProperties = await getLocalPropertyIndex();

      const { toCreate, toUpdate, toDelete } = diffServerAndLocal({
        server: serverProperties,
        local: localProperties,
        serverIdKey: "id",
        localIdKey: "id",
        shouldDelete: getPropertyDeleteRule(
          isAdmin ? "admin" : isAgent ? "agent" : "user"
        ),
        shouldUpdate: compareDates,
        mode: isIncremental ? "incremental" : "full",
      });

      if (toCreate.length || toUpdate.length || toDelete.length) {
        await syncProperties({
          create: toCreate,
          update: toUpdate,
          delete: toDelete,
          batchSize: BATCH_SIZE,
        });
      }

      const timestamps = serverProperties
        .map((p) => (p.updated_at ? Date.parse(p.updated_at) : 0))
        .filter((t) => t > 0);

      if (timestamps.length) {
        mainStore.propertyLastSyncAt.set(Math.max(...timestamps));
      }

      console.log(
        `✅ Property sync done (server=${serverProperties.length}, create=${toCreate.length}, update=${toUpdate.length}, delete=${toDelete.length})`
      );
    } catch (error) {
      console.error("Property sync error:", error);
    } finally {
      syncingRef.current = false;
      globalSyncing = false;
      setSyncing(false);
    }
  }, [isAdmin, isAgent, me]);

  return {
    syncing,
    resync,
  };
}
