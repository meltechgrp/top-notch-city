import { sendTyping } from "@/actions/message";
import { EditorOnchangeArgs } from "@/components/editor";
import { useDeferredValue, useEffect, useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "paused";
export function useChatComposer({
  onSend,
  chatId,
}: {
  onSend: (arg: EditorOnchangeArgs) => void;
  chatId: string;
}) {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [typing, setTyping] = useState(false);
  const [recorder, setRecorder] = useState<RecorderState>("idle");
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deferredText = useDeferredValue(text);
  const isComposing = text.length > 0 || media.length > 0;

  function submit() {
    if (!text.trim() && media.length === 0) return;
    onSend({ text: text || " ", files: media });
    setText("");
    setMedia([]);
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

  return {
    text,
    setText,
    media,
    setMedia,
    typing,
    setTyping,
    recorder,
    setRecorder,
    isComposing,
    submit,
    deferredText,
  };
}
