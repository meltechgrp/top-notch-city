import { StateCreator, create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareAsc } from "date-fns";

export type ChatState = {
  chatList: ChatList[];
  getSender: (chatId: string) => string | undefined;
  getReceiver: (chatId: string) => ReceiverInfo | undefined;
  getMessages: (chatId: string) => Message[];
  getChatList: () => Chat[];
  getTyping: (chatId: string) => boolean;

  // Actions
  updateChatMessages: (chatId: string, newMessages: Message[]) => void;
  addPendingMessage: (chatId: string, newMessage: Message | Message[]) => void;
  clearChatMessages: (chatId: string) => void;
  deleteChatMessage: (
    chatId: string,
    messageId: string,
    soft?: boolean
  ) => void;
  updateChatList: (data: ChatList[]) => void;
  updateChatListDetails: (data: ChatList["details"]) => void;
  deleteChat: (chatId: string) => void;
  setTyping: (chatId: string, typing: boolean) => void;
  updateUserStatus: (chatId: string, status: ReceiverInfo["status"]) => void;
  updateMessageStatus: (
    chatId: string,
    messageId: string,
    status: Message["status"]
  ) => void;
  addIncomingMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  replaceMockMessage: (
    chatId: string,
    tempId: string,
    patch: Partial<Message>
  ) => void;
  resetChatStore: () => void;
  hasChat: (chatId: string) => boolean;
};

type MyPersist<T> = (
  config: StateCreator<T>,
  options: PersistOptions<T>
) => StateCreator<T>;

function findChatIndex(chatList: ChatList[], chatId: string) {
  return chatList.findIndex((c) => c.details.chat_id === chatId);
}

function mergeUniqueMessagesKeepLatest(messages: Message[]): Message[] {
  const map = new Map<string, Message>();
  for (const m of messages) {
    map.set(m.message_id, m);
  }
  const arr = Array.from(map.values());
  arr.sort((a, b) =>
    compareAsc(new Date(a.created_at), new Date(b.created_at))
  );
  return arr;
}

function safeMergeMessage(base: Message, patch: Partial<Message>): Message {
  const entries = Object.entries(patch).filter(([, v]) => v !== undefined);
  return { ...base, ...Object.fromEntries(entries) } as Message;
}

export const useChatStore = create<ChatState>(
  (persist as MyPersist<ChatState>)(
    (set, get) => ({
      chatList: [],

      getSender: (chatId) =>
        get().chatList.find((c) => c.details.chat_id === chatId)?.details
          .sender_id,

      getReceiver: (chatId) =>
        get().chatList.find((c) => c.details.chat_id === chatId)?.details
          .receiver,

      getTyping: (chatId) =>
        !!get().chatList.find((c) => c.details.chat_id === chatId)?.typing,

      getMessages: (chatId) =>
        get().chatList.find((c) => c.details.chat_id === chatId)?.messages ??
        [],
      getChatList: () => get().chatList.map((l) => l.details) || [],

      updateChatMessages: (chatId, newMessages) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          const merged = [...chatList[idx].messages, ...newMessages];
          const uniqueSorted = mergeUniqueMessagesKeepLatest(merged);

          chatList[idx] = { ...chatList[idx], messages: uniqueSorted };
          return { chatList };
        }),

      addPendingMessage: (chatId, newMessage) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          const incoming = Array.isArray(newMessage)
            ? newMessage
            : [newMessage];
          const merged = [...chatList[idx].messages, ...incoming];
          chatList[idx] = {
            ...chatList[idx],
            messages: mergeUniqueMessagesKeepLatest(merged),
          };
          return { chatList };
        }),

      updateUserStatus: (chatId, status) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          chatList[idx] = {
            ...chatList[idx],
            details: {
              ...chatList[idx].details,
              receiver: {
                ...(chatList[idx].details.receiver ?? {}),
                status,
              },
            },
          };
          return { chatList };
        }),

      clearChatMessages: (chatId) =>
        set((state) => ({
          chatList: state.chatList.map((c) =>
            c.details.chat_id === chatId ? { ...c, messages: [] } : c
          ),
        })),

      deleteChatMessage: (chatId, messageId, soft = true) =>
        set((state) => ({
          chatList: state.chatList.map((c) => {
            if (c.details.chat_id !== chatId) return c;
            return {
              ...c,
              messages: soft
                ? c.messages.map((m) =>
                    m.message_id === messageId
                      ? { ...m, deleted_at: new Date().toISOString() }
                      : m
                  )
                : c.messages.filter((m) => m.message_id !== messageId),
            };
          }),
        })),

      updateChatList: (data) =>
        set((state) => {
          const existing = [...state.chatList];

          const existingMap = new Map(
            existing.map((c) => [c.details.chat_id, c] as const)
          );

          const mergedList: ChatList[] = data.map((incoming) => {
            const id = incoming.details.chat_id;
            const prev = existingMap.get(id);
            if (!prev) {
              return {
                ...incoming,
                messages: mergeUniqueMessagesKeepLatest(
                  incoming.messages ?? []
                ),
              };
            }

            const combinedMessages = mergeUniqueMessagesKeepLatest([
              ...(prev.messages ?? []),
              ...(incoming.messages ?? []),
            ]);

            return {
              ...prev,
              details: { ...prev.details, ...incoming.details },
              messages: combinedMessages,
            };
          });

          const incomingIds = new Set(data.map((d) => d.details.chat_id));
          const remaining = existing.filter(
            (c) => !incomingIds.has(c.details.chat_id)
          );

          return { chatList: [...mergedList, ...remaining] };
        }),

      updateChatListDetails: (details) =>
        set((state) => ({
          chatList: state.chatList.map((c) =>
            c.details.chat_id === details.chat_id
              ? { ...c, details: { ...c.details, ...details } }
              : c
          ),
        })),

      addIncomingMessage: (chatId, message) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          const merged = [...chatList[idx].messages, message];
          chatList[idx] = {
            ...chatList[idx],
            messages: mergeUniqueMessagesKeepLatest(merged),
          };
          return { chatList };
        }),

      updateMessageStatus: (chatId, messageId, status) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          chatList[idx] = {
            ...chatList[idx],
            messages: chatList[idx].messages.map((m) =>
              m.message_id === messageId ? { ...m, status } : m
            ),
          };
          return { chatList };
        }),

      setTyping: (chatId, typing) =>
        set((state) => ({
          chatList: state.chatList.map((c) =>
            c.details.chat_id === chatId ? { ...c, typing } : c
          ),
        })),

      deleteChat: (chatId) =>
        set((state) => ({
          chatList: state.chatList.filter((c) => c.details.chat_id !== chatId),
        })),

      resetChatStore: () => set(() => ({ chatList: [] })),

      hasChat: (chatId) =>
        get().chatList.some((c) => c.details.chat_id === chatId),

      updateMessage: (chatId, messageId, content) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          chatList[idx] = {
            ...chatList[idx],
            messages: chatList[idx].messages.map((m) =>
              m.message_id === messageId
                ? { ...m, content, updated_at: new Date().toISOString() }
                : m
            ),
          };
          return { chatList };
        }),

      replaceMockMessage: (chatId, tempId, patch) =>
        set((state) => {
          const chatList = [...state.chatList];
          const idx = findChatIndex(chatList, chatId);
          if (idx === -1) return { chatList };

          chatList[idx] = {
            ...chatList[idx],
            messages: chatList[idx].messages.map((m) =>
              m.message_id === tempId ? safeMergeMessage(m, patch) : m
            ),
          };
          return { chatList };
        }),
    }),
    {
      name: "top-notch-chatStorage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
