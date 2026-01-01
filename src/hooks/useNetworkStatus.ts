import { useEffect, useState, useCallback } from "react";
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";

type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean;
  isOffline: boolean;
  type: NetInfoStateType;
  isWifi: boolean;
  isCellular: boolean;
  details: NetInfoState["details"] | null;
  refresh: () => Promise<void>;
};

const normalizeState = (state: NetInfoState): NetworkStatus => {
  const isConnected = Boolean(state.isConnected);
  const isInternetReachable = Boolean(state.isInternetReachable);

  return {
    isConnected,
    isInternetReachable,
    isOffline: !isConnected || !isInternetReachable,
    type: state.type,
    isWifi: state.type === NetInfoStateType.wifi,
    isCellular: state.type === NetInfoStateType.cellular,
    details: state.details ?? null,
    refresh: async () => {},
  };
};

export const useNetworkStatus = (): NetworkStatus => {
  const [state, setState] = useState<NetworkStatus>(() =>
    normalizeState({
      type: NetInfoStateType.unknown,
      isConnected: null,
      isInternetReachable: null,
      details: null,
    } as NetInfoState)
  );

  const refresh = useCallback(async () => {
    const next = await NetInfo.fetch();
    setState((prev) => ({
      ...normalizeState(next),
      refresh: prev.refresh,
    }));
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((next) => {
      setState((prev) => ({
        ...normalizeState(next),
        refresh: prev.refresh,
      }));
    });
    refresh();

    return unsubscribe;
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
};
