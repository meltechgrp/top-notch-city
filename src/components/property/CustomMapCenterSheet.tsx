import React, { useState } from "react";
import Map from "../location/map";
import Layout from "@/constants/Layout";
import { Modal, Pressable, View } from "react-native";
import { Icon } from "../ui";
import { X } from "lucide-react-native";
import { usePropertyStore } from "@/store/propertyStore";

export function CustomCenterSheet() {
  const [open, setOpen] = useState(false);
  const { details } = usePropertyStore();
  if (!details) return null;
  function handleDismiss() {
    setOpen(false);
  }
  const { longitude, latitude } = details.address;
  const MODAL_WIDTH = Math.round(Layout.window.width * 0.85);
  const MODAL_HEIGHT = Math.round(Layout.window.height * 0.7);
  const MINI_HEIGHT = Math.round(Layout.window.height * 0.3);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ height: MINI_HEIGHT }}
        className="flex-1 bg-background-muted h-40 relative overflow-hidden"
      >
        <Map
          height={MINI_HEIGHT}
          latitude={latitude}
          longitude={longitude}
          scrollEnabled={false}
          showRadius
          radiusInMeters={500}
          delta={0.02}
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
            onTouchEnd={(ev) => ev.stopPropagation()} // prevent dismiss
          >
            <Map
              latitude={latitude}
              longitude={longitude}
              height={MODAL_HEIGHT}
              scrollEnabled={true}
              showRadius
              radiusInMeters={600}
              delta={0.02}
            />

            <Pressable
              onPress={handleDismiss}
              className="absolute top-3 right-3 bg-background-muted p-2 rounded-full items-center justify-center z-10"
            >
              <Icon as={X} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
