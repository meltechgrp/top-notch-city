import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

export function useDebouncedVisibility({
  visible,
  currentIndex,
  reels,
  playersRef,
}: {
  visible: boolean;
  currentIndex: number;
  reels: ReelVideo[];
  playersRef: React.RefObject<Record<string, VideoPlayerHandle | null>>;
}) {
  const isFocused = useIsFocused();
  const handlePause = () => {
    Object.values(playersRef.current).forEach((player) => {
      player?.pause?.();
    });
  };
  const handleCurrentPlay = () => {
    {
      const currentReel = reels[currentIndex];
      const currentPlayer = playersRef.current[currentReel?.id];
      currentPlayer?.play?.();
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!visible) handlePause();
      else handleCurrentPlay();
    }, 300);

    return () => clearTimeout(timeout);
  }, [visible, currentIndex, reels]);

  // App minimized
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") handlePause();
      else if (visible) handleCurrentPlay();
    });
    return () => sub.remove();
  }, [visible, currentIndex, reels]);
  // // Screen unfocused
  useEffect(() => {
    if (!isFocused || AppState.currentState !== "active") handlePause();
    else if (visible) handleCurrentPlay();
  }, [isFocused, visible, currentIndex, reels]);
}
