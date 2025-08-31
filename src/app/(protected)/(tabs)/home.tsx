import CreateButton from "@/components/custom/CreateButton";
import ParallaxScrollView from "@/components/custom/ParallaxScrollView";
import { openSignInModal } from "@/components/globals/AuthModals";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopProperties from "@/components/home/properties";
import TopLocations from "@/components/home/topLocations";
import { View } from "@/components/ui";
import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import eventBus from "@/lib/eventBus";
import { useStore } from "@/store";
import React, { useEffect } from "react";
const MAP_HEIGHT = 400;

export default function HomeScreen() {
  const { hasAuth, me } = useStore();
  const { refreshAll } = useHomeFeed();
  useEffect(() => {
    eventBus.dispatchEvent("REFRESH_PROFILE", null);
  }, []);

  const [friendsModal, setFriendsModal] = React.useState(false);

  const onNewChat = () => {
    setFriendsModal(true);
  };
  useEffect(() => {
    if (hasAuth) {
      openSignInModal({ visible: false });
    }
  }, [hasAuth]);
  return (
    <>
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
      {me && <CreateButton className="" onPress={onNewChat} />}
      {me && friendsModal && (
        <StartChatBottomSheet
          visible={friendsModal}
          onDismiss={() => setFriendsModal(false)}
          onSelect={(member) => {}}
          me={me}
        />
      )}
    </>
  );
}
