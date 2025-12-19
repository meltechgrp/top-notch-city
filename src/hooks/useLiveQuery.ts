// hooks/useLiveQuery.ts
import { useEffect, useState } from "react";
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
): LiveQueryState<T> {
  const version = useDbStore((s) => s.version);

  const [state, setState] = useState<LiveQueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setState((s) => ({ ...s, isLoading: true, error: null }));

        const result = await queryFn();

        if (!active) return;

        setState({
          data: result,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (!active) return;

        console.error("useLiveQuery error:", err);

        setState({
          data: null,
          isLoading: false,
          error: err as Error,
        });
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [version, ...deps]);

  return state;
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
