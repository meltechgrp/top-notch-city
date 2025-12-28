import { cn } from "@/lib/utils";
import React, {
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Keyboard, TextInput, TextInputProps, View } from "react-native";
import { CameraIcon, Send } from "lucide-react-native";
import { Icon, Pressable } from "../ui";
import MediaPicker, { MediaPickerRef } from "@/components/custom/MediaPicker";
import { sendTyping } from "@/actions/message";

export type EditorOnchangeArgs = { text: string; files: Media[] };
type Props = View["props"] & {
  onBlur?: () => void;
  onSend: (arg: EditorOnchangeArgs) => void;
  onUpdate?: (arg: EditorOnchangeArgs) => void;
  fileLimit?: number;
  placeholder?: string;
  commentId?: string | null;
  value?: string;
  HeaderComponent?: any;
  noMedia?: boolean;
  chatId: string;
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
    onUpdate,
    commentId,
    onBlur,
    className,
    HeaderComponent,
    fileLimit = 3,
    autoFocus,
    value = "",
    noMedia,
    chatId,
  } = props;
  const mediaPickerRef = React.useRef<MediaPickerRef>(null);
  const [text, setText] = React.useState(value);
  const [typing, setTyping] = useState(false);
  const [media, setMedia] = React.useState<Media[]>([]);
  const textInputRef = React.useRef<TextInput>(null);
  const typingTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isComposing = useMemo(() => {
    return text.length > 0 || media.length > 0;
  }, [text, media]);

  function onSubmit() {
    if (!text.trim() && media.length === 0) return;
    onSend({ text: text.length !== 0 ? text : " ", files: media });
    setText("");
    setMedia([]);
    setTyping(false);
  }
  React.useEffect(() => {
    if (onUpdate) {
      onUpdate({ text, files: media });
    }
  }, [text, media]);
  React.useEffect(() => {
    if (commentId && textInputRef) {
      textInputRef.current?.focus();
    }
  }, [commentId]);
  useImperativeHandle(ref, () => {
    return {
      focus() {
        Keyboard.dismiss();
        textInputRef.current?.focus();
      },
      setText,
    };
  }, []);
  const handleTyping = (val: string) => {
    setText(val);
    if (!typing) setTyping(true);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
    }, 2000); // stop typing after 2s of inactivity
  };

  function SendTyping(typing: boolean) {
    sendTyping({ chat_id: chatId, is_typing: typing });
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      SendTyping(typing);
    }, 500);
    return () => clearTimeout(timeout);
  }, [typing, text]);
  return (
    <View
      className={cn("w-full relative border-t border-t-outline", className)}
    >
      {HeaderComponent && <HeaderComponent />}
      <MediaPicker
        ref={mediaPickerRef as any}
        max={fileLimit}
        media={media}
        onChange={setMedia}
        className="px-4 pt-4"
      />

      <View className={cn("w-full px-4 pt-3 pb-2", style)}>
        <View className="flex-row items-start">
          {!noMedia && (
            <View className="flex-row items-end">
              <Pressable
                className={cn(
                  "h-12 w-12 items-center justify-center rounded-xl disabled:opacity-50"
                )}
                onPress={() => mediaPickerRef.current?.pick?.()}
                disabled={media.length >= fileLimit}
              >
                <Icon as={CameraIcon} />
              </Pressable>
            </View>
          )}

          <View className="flex-row items-center p-2  flex-1">
            <TextInput
              ref={textInputRef}
              autoFocus={autoFocus}
              onBlur={() => {
                if (text.length === 0) {
                  onBlur?.();
                }
              }}
              value={text}
              onChangeText={handleTyping}
              className="flex-1 text-typography max-h-[100px]"
              multiline={true}
              placeholder={placeholder}
              placeholderTextColor={"#A0AEC0"}
            />
          </View>

          <View className="flex-row items-end pl-2 gap-x-4">
            <Pressable
              className={cn(
                "bg-primary h-12 w-12 items-center justify-center rounded-xl",
                !isComposing && "opacity-50"
              )}
              onPress={onSubmit}
            >
              <Send color={"white"} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
});

export default memo(EditorComponent);
