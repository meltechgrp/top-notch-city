import React, { useMemo, useState } from "react";
import Map from "../location/map";
import Layout from "@/constants/Layout";
import { Modal, Pressable, View } from "react-native";
import { Icon } from "../ui";
import { Layers, X } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { getNearbyPlaces } from "@/actions/property";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownSelect from "@/components/custom/DropdownSelect";
import eventBus from "@/lib/eventBus";

interface CustomCenterSheetProps {
  address: ServerProperty["address"];
}

export function CustomCenterSheet({ address }: CustomCenterSheetProps) {
  const [open, setOpen] = useState(false);
  function handleDismiss() {
    setOpen(false);
  }
  const { longitude, latitude } = address;
  const { data, isLoading } = useQuery({
    queryKey: [latitude, latitude],
    queryFn: () => getNearbyPlaces({ latitude, longitude, radiusMeters: 5000 }),
  });
  const nearby = useMemo(() => data?.slice() || [], [data]);
  const MODAL_WIDTH = Math.round(Layout.window.width);
  const MODAL_HEIGHT = Math.round(Layout.window.height);
  const MINI_HEIGHT = Math.round(Layout.window.height * 0.4);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ height: MINI_HEIGHT }}
        className="flex-1 bg-background-muted h-48 relative overflow-hidden"
      >
        <Map
          height={MINI_HEIGHT}
          latitude={latitude}
          longitude={longitude}
          scrollEnabled={false}
          showRadius
          nearby={nearby}
          radiusInMeters={500}
          delta={0.05}
        />
      </Pressable>

      <Modal
        animationType="fade"
        visible={open}
        transparent
        onRequestClose={handleDismiss}
      >
        <View
          className="flex-1 items-center justify-center bg-black/30"
          onTouchEnd={handleDismiss}
        >
          <View
            style={{
              width: MODAL_WIDTH,
              height: MODAL_HEIGHT,
            }}
            className="bg-background-muted rounded-2xl overflow-hidden relative"
            onTouchEnd={(ev) => ev.stopPropagation()}
          >
            <Map
              latitude={latitude}
              longitude={longitude}
              height={MODAL_HEIGHT}
              scrollEnabled={true}
              showRadius
              nearby={nearby}
              radiusInMeters={500}
              delta={0.05}
            />

            <View className=" absolute top-12 z-10 left-0 w-full">
              <SafeAreaView
                edges={["top"]}
                className="flex-row justify-between items-center flex-1 px-4 pt-2"
              >
                <DropdownSelect
                  options={["standard", "satellite", "hybrid"]}
                  onChange={(val) => {
                    eventBus.dispatchEvent("MAP_SET_TYPE", val);
                  }}
                  className=" rounded-full bg-background-muted/90"
                  icon={Layers}
                />
                <Pressable
                  onPress={handleDismiss}
                  className=" bg-background-muted p-3 border border-primary rounded-full items-center justify-center "
                >
                  <Icon as={X} />
                </Pressable>
              </SafeAreaView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
