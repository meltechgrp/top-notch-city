import ParallaxScrollView from "@/components/custom/ParallaxScrollView";
import { openSignInModal } from "@/components/globals/AuthModals";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopProperties from "@/components/home/properties";
import TopLocations from "@/components/home/topLocations";
import { View } from "@/components/ui";
import useGetLocation from "@/hooks/useGetLocation";
import eventBus from "@/lib/eventBus";
import { useStore } from "@/store";
import React, { useEffect } from "react";
const MAP_HEIGHT = 400;

export default function HomeScreen() {
  const { retryGetLocation } = useGetLocation();
  const { hasAuth } = useStore();

  async function onRefresh() {
    eventBus.dispatchEvent("PROPERTY_HORIZONTAL_LIST_REFRESH", null);
  }
  useEffect(() => {
    eventBus.dispatchEvent("REFRESH_PROFILE", null);
  }, []);
  useEffect(() => {
    if (hasAuth) {
      openSignInModal({ visible: false });
    }
  }, [hasAuth]);
  useEffect(() => {
    setTimeout(async () => {
      await retryGetLocation();
    }, 2000);
  }, []);
  return (
    <ParallaxScrollView
      headerHeight={MAP_HEIGHT}
      onRefresh={onRefresh}
      headerComponent={<DiscoverProperties mapHeight={MAP_HEIGHT} />}
    >
      {/* Feed items */}
      <TopLocations />
      <TopProperties />
      <View className="h-24" />
    </ParallaxScrollView>
  );
}
