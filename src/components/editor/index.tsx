import { cn, guidGenerator } from "@/lib/utils";
import React, {
  memo,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Keyboard, TextInput, TextInputProps, View } from "react-native";
import MediaPicker, { MediaPickerRef } from "@/components/media/MediaPicker";
import {
  useAudioRecorder,
  RecordingPresets,
  useAudioRecorderState,
} from "expo-audio";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AudioRecorderComposer } from "@/components/editor/AudioRecorderComposer";
import { ActionButtons } from "@/components/editor/ActionButtons";
import { SendButton } from "@/components/editor/SendButton";
import { sendTyping } from "@/actions/message";

type RecorderState = "idle" | "recording" | "paused";
export type EditorOnchangeArgs = { text: string; files: Media[] };
type Props = View["props"] & {
  onBlur?: () => void;
  onSend: (arg: EditorOnchangeArgs) => void;
  fileLimit?: number;
  placeholder?: string;
  commentId?: string | null;
  value?: string;
  HeaderComponent?: any;
  noMedia?: boolean;
  chatId: string;
  fullName: string;
};

export type EditorComponentRefHandle = Pick<TextInput, "focus"> & {
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const EditorComponent = React.forwardRef<
  EditorComponentRefHandle,
  TextInputProps & Props
>((props, ref) => {
  const {
    style,
    placeholder,
    onSend,
    commentId,
    onBlur,
    className,
    HeaderComponent,
    fileLimit = 10,
    autoFocus,
    value = "",
    noMedia,
    chatId,
    fullName,
  } = props;

  const mediaPickerRef = React.useRef<MediaPickerRef>(null);
  const inputRef = React.useRef<TextInput>(null);

  const [text, setText] = useState(value);
  const [typing, setTyping] = useState(false);
  const [recorder, setRecorder] = useState<RecorderState>("idle");
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deferredText = useDeferredValue(text);
  const isComposing = text.length > 0;

  function submit() {
    if (!text.trim()) return;
    onSend({ text: text || " ", files: [] });
    setText("");
  }
  useEffect(() => {
    if (!typing) setTyping(true);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  }, [deferredText]);
  useEffect(() => {
    const t = setTimeout(() => {
      sendTyping({ chat_id: chatId, is_typing: typing });
    }, 500);
    return () => clearTimeout(t);
  }, [typing, deferredText]);

  // 🎧 Audio
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const { durationMillis, url, isRecording } =
    useAudioRecorderState(audioRecorder);

  const iconsOpacity = useSharedValue(1);
  const sendOpacity = useSharedValue(1);
  async function startRecording() {
    try {
      Keyboard.dismiss();
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    isRecording && setRecorder("recording");
  }, [isRecording]);
  async function pauseRecording() {
    await audioRecorder.stop();
    setRecorder("paused");
  }

  function cancelRecording() {
    audioRecorder.stop();
    setRecorder("idle");
  }

  async function sendAudio() {
    if (!url) return;
    await audioRecorder.stop();
    submit();
    onSend({
      text: "",
      files: [
        {
          id: guidGenerator(),
          url,
          media_type: "AUDIO",
          is_local: true,
        },
      ],
    });
    setRecorder("idle");
  }
  useEffect(() => {
    if (isComposing) {
      iconsOpacity.value = withTiming(0, { duration: 180 });
    } else {
      iconsOpacity.value = withTiming(1);
    }
  }, [isComposing]);
  useEffect(() => {
    if (isComposing || recorder !== "idle") {
      sendOpacity.value = withTiming(1);
    } else {
      sendOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [isComposing, recorder]);

  const iconsStyle = useAnimatedStyle(() => ({
    opacity: iconsOpacity.value,
    transform: [{ scale: iconsOpacity.value }],
  }));
  const sendStyle = useAnimatedStyle(() => ({
    opacity: sendOpacity.value,
    transform: [{ scale: sendOpacity.value }],
  }));

  React.useEffect(() => {
    if (commentId && inputRef) {
      inputRef.current?.focus();
    }
  }, [commentId]);
  useImperativeHandle(ref, () => {
    return {
      focus() {
        Keyboard.dismiss();
        inputRef.current?.focus();
      },
      setText,
    };
  }, []);

  return (
    <View className="w-full relative bg-background">
      {HeaderComponent && <HeaderComponent />}
      <MediaPicker
        ref={mediaPickerRef}
        max={fileLimit}
        onSend={onSend}
        isChat
        fullName={fullName}
      />

      <View className={cn("flex-row py-2 px-4 items-end ", style)}>
        <View className="flex-row items-end">
          <View className="flex-row flex-1 min-h-12 items-end gap-3">
            {recorder === "idle" && (
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                autoFocus={autoFocus}
                onBlur={() => {
                  if (text.length === 0) {
                    onBlur?.();
                  }
                }}
                className={cn(
                  " px-4 min-h-12 py-3 bg-background-muted flex-1 border border-outline-100 placeholder:text-typography rounded-3xl text-typography max-h-[100px]",
                )}
                style={{
                  textAlignVertical: text.length === 0 ? "bottom" : "top",
                }}
                multiline={true}
                placeholder={placeholder}
                placeholderClassName="text-typography/80"
              />
            )}

            {recorder !== "idle" && (
              <AudioRecorderComposer
                isRecording={isRecording}
                currentTime={0}
                duration={durationMillis}
                onCancel={cancelRecording}
                onPause={pauseRecording}
                url={url}
              />
            )}

            {!isComposing && recorder === "idle" && !noMedia && (
              <Animated.View style={iconsStyle} className="flex-row gap-2">
                <ActionButtons
                  show={!isComposing && recorder === "idle" && !noMedia}
                  onCamera={() => mediaPickerRef.current?.open()}
                  onMic={startRecording}
                />
              </Animated.View>
            )}

            {(isComposing || recorder !== "idle") && (
              <Animated.View style={sendStyle}>
                <SendButton
                  onPress={
                    recorder === "paused" || recorder === "recording"
                      ? sendAudio
                      : submit
                  }
                />
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});

export default memo(EditorComponent);
