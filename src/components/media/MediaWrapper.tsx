import * as React from "react";
import { View } from "react-native";

import {
  BarcodeScanningResult,
  CameraMode,
  CameraView,
  FlashMode,
} from "expo-camera";
import BottomRowTools from "@/components/media/BottomRowTools";
import CameraTools from "@/components/media/CameraTools";
import * as WebBrowser from "expo-web-browser";
import QRCodeButton from "@/components/media/QRCodeButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Icon, Pressable } from "@/components/ui";
import { X } from "lucide-react-native";
import MainRowActions from "@/components/media/MainRowActions";
import { fetchPreview, parseQRCodeLink } from "@/components/media";
import { uniqueId } from "lodash-es";
import { router } from "expo-router";
import { MediaType } from "@/hooks/useMediaUpload";

interface MediaWrapperProps {
  onClose: () => void;
  onFiles: (media: UploadedFile[]) => void;
  max?: number;
  type: MediaType;
  media: Media[];
  openPreview: () => void;
  pickMedia: () => void;
}

const MediaWrapper = (props: MediaWrapperProps) => {
  const { onClose, onFiles, max, type, media, openPreview, pickMedia } = props;
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);

  const [isBrowsing, setIsBrowsing] = React.useState<boolean>(false);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [qrCodeDetected, setQrCodeDetected] = React.useState<string>("");
  const [preview, setPreview] = React.useState<{
    type: "agent" | "property";
    data: any;
  } | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const insets = useSafeAreaInsets();
  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    response &&
      onFiles([
        {
          url: response.uri,
          id: uniqueId("media_"),
          media_type: "IMAGE",
          loading: false,
          progress: 0,
        },
      ]);
    openPreview();
  }

  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const response = await cameraRef.current?.recordAsync();
      response &&
        onFiles([
          {
            url: response.uri,
            id: uniqueId("media_"),
            media_type: "VIDEO",
            loading: false,
            progress: 0,
          },
        ]);
    }
  }

  async function handleOpenQRCode() {
    const parsed = parseQRCodeLink(qrCodeDetected);
    setIsBrowsing(true);
    if (parsed.deepLink) {
      onClose();
      router.push(parsed.deepLink as any);
    }
    if (parsed.type === "external" && parsed.webUrl) {
      await WebBrowser.openBrowserAsync(parsed.webUrl);
      return onClose();
    }
  }

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (result.data) {
      if (!qrCodeDetected) {
        const parsed = parseQRCodeLink(result.data);
        if (parsed.type != "external" && !preview) {
          const pre = await fetchPreview(parsed);
          pre && setPreview(pre);
        }
        setQrCodeDetected(result.data);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setQrCodeDetected("");
        setPreview(null);
      }, 1200);
    }
  };

  if (isBrowsing) return <></>;

  return (
    <Box className="flex-1 relative">
      <View>
        <Pressable
          onPress={onClose}
          style={{ top: insets.top + 8 }}
          className="p-3 self-start z-10 border absolute left-5 border-outline-100 bg-background-muted rounded-full"
        >
          <Icon as={X} size="xl" color="white" />
        </Pressable>

        <CameraTools
          cameraZoom={cameraZoom}
          cameraFlash={cameraFlash}
          cameraTorch={cameraTorch}
          setCameraZoom={setCameraZoom}
          setCameraTorch={setCameraTorch}
          setCameraFlash={setCameraFlash}
          top={insets.top}
        />
      </View>
      <View className="flex-1">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraFacing}
          mode={cameraMode}
          zoom={cameraZoom}
          enableTorch={cameraTorch}
          flash={cameraFlash}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
          onCameraReady={() => console.log("camera is ready")}
        />
      </View>
      <View>
        {qrCodeDetected ? (
          <QRCodeButton
            bottom={insets.bottom}
            preview={preview}
            qrCodeDetected={qrCodeDetected}
            handleOpenQRCode={handleOpenQRCode}
          />
        ) : null}
        <MainRowActions
          media={media}
          handleTakePicture={
            cameraMode === "picture" ? handleTakePicture : toggleRecord
          }
          openPreview={openPreview}
          cameraMode={cameraMode}
          isRecording={isRecording}
          setCameraFacing={setCameraFacing}
          pickMedia={pickMedia}
          bottom={insets.bottom}
        />
        {type == "all" && (
          <BottomRowTools
            bottom={insets.bottom}
            cameraMode={cameraMode}
            setCameraMode={setCameraMode}
          />
        )}
      </View>
    </Box>
  );
};

export default MediaWrapper;
