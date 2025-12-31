import { useCallback, useEffect, useRef, useState } from "react";
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

export function usePropertyFeedSync(auto = true) {
  const { isAdmin, isAgent } = useMe();
  const [syncing, setSyncing] = useState(false);
  const hasAutoSynced = useRef(false);
  const resync = useCallback(async () => {
    if (syncing) return;
    try {
      setSyncing(true);

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
        mode: "full",
        // mode: isIncremental ? "incremental" : "full",
      });

      await syncProperties({
        create: toCreate,
        update: toUpdate,
        delete: toDelete,
        batchSize: BATCH_SIZE,
      });
      const newestUpdatedAt = Math.max(
        ...serverProperties.map((p) => Date.parse(p.updated_at))
      );

      mainStore.propertyLastSyncAt.set(newestUpdatedAt);
      console.log(
        `✅ Property sync done (server=${serverProperties.length}, create=${toCreate.length}, update=${toUpdate.length}, delete=${toDelete.length})`
      );
    } finally {
      setSyncing(false);
    }
  }, [isAdmin, isAgent, syncing]);
  useEffect(() => {
    if (!auto || hasAutoSynced.current) return;

    hasAutoSynced.current = true;
    resync();
  }, [auto, resync]);
  return {
    syncing,
    resync,
  };
}
