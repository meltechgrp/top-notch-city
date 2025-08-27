import ParallaxScrollView from "@/components/custom/ParallaxScrollView";
import { openSignInModal } from "@/components/globals/AuthModals";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopProperties from "@/components/home/properties";
import TopLocations from "@/components/home/topLocations";
import { View } from "@/components/ui";
import { useChat } from "@/hooks/useChat";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import eventBus from "@/lib/eventBus";
import { useStore } from "@/store";
import React, { useEffect } from "react";
const MAP_HEIGHT = 400;

export default function HomeScreen() {
  const { hasAuth } = useStore();
  const { refreshAll } = useHomeFeed();
  useChat();
  useEffect(() => {
    eventBus.dispatchEvent("REFRESH_PROFILE", null);
  }, []);
  useEffect(() => {
    if (hasAuth) {
      openSignInModal({ visible: false });
    }
  }, [hasAuth]);
  return (
    <ParallaxScrollView
      headerHeight={MAP_HEIGHT}
      onRefresh={refreshAll}
      headerComponent={<DiscoverProperties mapHeight={MAP_HEIGHT} />}
    >
      {/* Feed items */}
      <TopLocations />
      <TopProperties />
      <View className="h-24" />
    </ParallaxScrollView>
  );
}
