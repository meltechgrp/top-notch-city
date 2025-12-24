// hooks/useLiveQuery.ts
import React from "react";
import { useDbStore } from "@/store/dbStore";

const ONE_DAY = 1000 * 60 * 60 * 24;

type LiveQueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useLiveQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const version = useDbStore((s) => s.version);

  const [state, setState] = React.useState<LiveQueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const queryRef = React.useRef(queryFn);
  queryRef.current = queryFn;

  const run = React.useCallback(async () => {
    setState((s) => (s.isLoading ? s : { ...s, isLoading: true, error: null }));

    try {
      const result = await queryRef.current();
      setState({ data: result, isLoading: false, error: null });
    } catch (err) {
      setState({ data: null, isLoading: false, error: err as Error });
    }
  }, []);

  React.useEffect(() => {
    run();
  }, [version, ...deps]);

  return { ...state, refetch: run };
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
