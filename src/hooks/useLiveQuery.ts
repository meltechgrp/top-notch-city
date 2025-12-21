// hooks/useLiveQuery.ts
import React from "react";
import { useDbStore } from "@/store/dbStore";

const ONE_DAY = 1000 * 60 * 60 * 24;

type LiveQueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useLiveQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): LiveQueryState<T> & { refetch: () => Promise<void> } {
  const version = useDbStore((s) => s.version);

  const [state, setState] = React.useState<LiveQueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const run = React.useCallback(async () => {
    let cancelled = false;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const result = await queryFn();
      if (cancelled) return;

      setState({
        data: result,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if (cancelled) return;

      setState({
        data: null,
        isLoading: false,
        error: err as Error,
      });
    }

    return () => {
      cancelled = true;
    };
  }, [queryFn]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await queryFn();
        if (cancelled) return;

        setState({
          data: result,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;

        setState({
          data: null,
          isLoading: false,
          error: err as Error,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [version, queryFn, ...deps]);

  return {
    ...state,
    refetch: async () => {
      await run();
    },
  };
}

export async function writeDb(fn: () => Promise<void>) {
  try {
    await fn();
  } finally {
    useDbStore.getState().bump();
  }
}

export function shouldSync(lastSync: number | null) {
  if (!lastSync) return true;
  return Date.now() - lastSync > ONE_DAY;
}
