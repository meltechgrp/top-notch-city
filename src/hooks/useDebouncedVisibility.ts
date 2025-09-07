import { useIsFocused } from "@react-navigation/native";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

export function useDebouncedVisibility({
  visible,
  currentIndex,
  reels,
  playersRef,
}: {
  visible: boolean;
  currentIndex: number;
  reels: Reel[];
  playersRef: React.RefObject<Record<string, VideoPlayerHandle | null>>;
}) {
  const isFocused = useIsFocused();
  const path = usePathname();
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
      if (!visible || path !== "/reels") handlePause();
      else handleCurrentPlay();
    }, 300);

    return () => clearTimeout(timeout);
  }, [visible, currentIndex, reels, path]);
  // App minimized
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") handlePause();
      else if (visible) {
        if (path !== "/reels") {
          return handlePause();
        }
        handleCurrentPlay();
      }
    });
    return () => sub.remove();
  }, [visible, path, currentIndex, reels]);
  // // Screen unfocused
  useEffect(() => {
    if (!isFocused || AppState.currentState !== "active") handlePause();
    else if (visible) {
      if (path !== "/reels") {
        return handlePause();
      }
      handleCurrentPlay();
    }
  }, [isFocused, visible, path, currentIndex, reels]);
}
