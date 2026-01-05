import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { View, Pressable, Image, Icon, Text, Badge } from "@/components/ui";
import { ImagePlusIcon, Trash2, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";
import { cn } from "@/lib/utils";
import { EditorOnchangeArgs } from "@/components/editor";
import { SendButton } from "@/components/editor/SendButton";
import {
  KeyboardAvoidingView,
  useKeyboardState,
} from "react-native-keyboard-controller";

const { width: W, height: H } = Dimensions.get("window");
type Props = {
  visible: boolean;
  media: UploadedFile[];
  initialIndex?: number;
  isChat?: boolean;
  max?: number;
  onDelete: (id: string) => void;
  onClose: () => void;
  pickMedia: () => void;
  fullName?: string;
  onUpload: (arg: EditorOnchangeArgs) => void;
};

export default function MediaPreviewView({
  visible,
  media,
  initialIndex = 0,
  isChat,
  onClose,
  onUpload,
  onDelete,
  pickMedia,
  max = 1,
  fullName,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(initialIndex);
  const [id, setId] = useState<string | null>(media[index].id || null);
  const [text, setText] = useState("");

  const translateY = React.useRef(new Animated.Value(H)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : H,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: W * index,
      animated: false,
    });
  }, [index]);
  useEffect(() => {
    if (index) {
      setId(media[index].id);
    }
  }, [index]);
  if (!visible) return null;
  const { isVisible } = useKeyboardState();
  return (
    <Animated.View
      className={"bg-background"}
      style={[styles.container, { transform: [{ translateY }] }]}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          // maxHeight: 600,
        }}
        className="bg-background-muted"
        behavior={"padding"}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 bg-background-muted relative">
          <Pressable
            onPress={onClose}
            style={[styles.closeBtn, { top: insets.top + 12 }]}
            className="border border-outline-100"
          >
            <Icon as={X} className="text-primary w-7 h-7" />
          </Pressable>
          <Pressable
            onPress={() => id && onDelete(id)}
            style={[{ top: insets.top + 12 }]}
            className="border p-2 z-50 absolute right-8 rounded-lg border-outline-100 bg-background-muted"
          >
            <Icon as={Trash2} className="text-primary w-8 h-8" />
          </Pressable>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setIndex(Math.round(e.nativeEvent.contentOffset.x / W));
            }}
          >
            {media.map((item, i) => (
              <View
                key={item.id}
                style={{
                  width: W,
                  height: H,
                  backgroundColor: "black",
                  justifyContent: "center",
                }}
              >
                {item.media_type === "VIDEO" ? (
                  <MiniVideoPlayer
                    uri={item.url}
                    canPlay={i === index}
                    autoPlay
                  />
                ) : (
                  <Image
                    source={{
                      uri: item.url,
                    }}
                    contentFit="contain"
                    style={{ width: W, height: H }}
                  />
                )}
              </View>
            ))}
          </ScrollView>

          {/* Thumbnails */}
          {!isVisible && (
            <View
              style={[
                styles.ThumbScroll,
                { bottom: insets.bottom + (isChat ? 80 : 20) },
              ]}
            >
              <ScrollView
                horizontal
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                {media.map((item, i) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setIndex(i)}
                    style={[styles.thumbWrap]}
                    className={cn(
                      " relative border-outline-100",
                      i === index && "border-primary"
                    )}
                  >
                    {item.media_type === "VIDEO" ? (
                      <MiniVideoPlayer
                        uri={item.url}
                        canPlay={false}
                        showPlayBtn
                      />
                    ) : (
                      <Image source={{ uri: item.url }} style={styles.thumb} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Chat Input */}
          {isChat && (
            <View
              className="absolute left-0 w-full right-0 justify-center flex-row"
              style={{ bottom: insets.bottom }}
            >
              <View
                className={cn(
                  "flex-row w-[85%] bg-background min-h-12 items-end rounded-[2rem] border border-outline-100 px-2 py-1",
                  text.length > 20 && "rounded-3xl"
                )}
              >
                <Pressable
                  className="p-2.5 border border-outline-100 rounded-full"
                  onPress={() => {
                    Keyboard.dismiss();
                    pickMedia();
                  }}
                  disabled={media.length >= max}
                >
                  <Icon size="xl" as={ImagePlusIcon} />
                </Pressable>
                <TextInput
                  placeholder="Add a message"
                  value={text}
                  onChangeText={setText}
                  className="flex-1 px-4 py-2 min-h-10 rounded-3xl text-typography max-h-[100px]"
                  multiline={true}
                  placeholderClassName="text-typography/80"
                />
                <SendButton
                  className="ml-auto"
                  onPress={() => {
                    onUpload({ text: text, files: media });
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    width: W,
    height: H,
    zIndex: 1000,
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1000,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
  },
  ThumbScroll: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  thumbWrap: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
});
