// hooks/useLiveQuery.ts
import { useEffect, useState } from "react";
import { useDbStore } from "@/store/dbStore";

const ONE_DAY = 1000 * 60 * 60 * 24;

export function useLiveQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const version = useDbStore((s) => s.version);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let active = true;

    queryFn().then((res) => {
      if (active) setData(res);
    });

    return () => {
      active = false;
    };
  }, [version, ...deps]);

  return data;
}

export async function writeDb(fn: () => Promise<void>) {
  await fn();
  useDbStore.getState().bump();
}

export function shouldSync(lastSync: number | null) {
  if (!lastSync) return true;
  return Date.now() - lastSync > ONE_DAY;
}
