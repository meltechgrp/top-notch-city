import { StateCreator, create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ChatState = {
  chatList: ChatList[];

  // Getters
  getSender: (chatId: string) => string | undefined;
  getReceiver: (chatId: string) => ReceiverInfo | undefined;
  getMessages: (chatId: string) => Message[];
  getMessage: (chatId: string) => Message | null;
  getChatList: () => Chat[];
  getTyping: (chatId: string) => boolean;

  // Actions
  updateChatMessages: (chatId: string, newMessages: Message[]) => void;
  addPendingMessage: (chatId: string, newMessage: Message[]) => void;
  clearChatMessages: (chatId: string) => void;
  deleteChatMessage: (chatId: string, messageId: string, soft: boolean) => void;
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
    message: Partial<Message>
  ) => void;
  resetChatStore: () => void;
  hasChat: (chatId: string) => boolean;
};

type MyChatPersist = (
  config: StateCreator<ChatState>,
  options: PersistOptions<ChatState>
) => StateCreator<ChatState>;

export const useChatStore = create<ChatState>(
  (persist as MyChatPersist)(
    (set, get) => {
      const findChatIndex = (chatList: ChatList[], chatId: string) =>
        chatList.findIndex((c) => c.details.chat_id === chatId);

      return {
        chatList: [],

        /** --- GETTERS --- */
        getSender: (chatId) =>
          get().chatList.find((c) => c.details.chat_id === chatId)?.details
            .sender_id,
        getReceiver: (chatId) =>
          get().chatList.find((c) => c.details.chat_id === chatId)?.details
            .receiver,
        getTyping: (chatId) =>
          !!get().chatList.find((c) => c.details.chat_id === chatId)?.typing,
        getMessages: (chatId) =>
          get().chatList.find((c) => c.details.chat_id === chatId)?.messages ||
          [],
        getMessage: (chatId) =>
          get().chatList.find((c) => c.details.chat_id === chatId)
            ?.messages[0] || null,
        getChatList: () => get().chatList.map((l) => l.details) || [],

        /** --- ACTIONS --- */
        updateMessage: (chatId, messageId, content) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
              chatList[idx] = {
                ...chatList[idx],
                messages: chatList[idx].messages.map((m) =>
                  m.message_id === messageId
                    ? { ...m, content, updated_at: new Date().toISOString() }
                    : m
                ),
              };
            }
            return { chatList };
          }),

        replaceMockMessage: (chatId, tempId, newMessage) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
              chatList[idx] = {
                ...chatList[idx],
                messages: chatList[idx].messages.map((m) =>
                  m.message_id === tempId ? { ...m, ...newMessage } : m
                ),
              };
            }
            return { chatList };
          }),

        updateChatMessages: (chatId, newMessages) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
              const merged = [...chatList[idx].messages, ...newMessages];
              const uniqueMap = new Map<string, Message>();
              merged.forEach((msg) => uniqueMap.set(msg.message_id, msg));
              const uniqueMessages = Array.from(uniqueMap.values()).sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );

              chatList[idx] = { ...chatList[idx], messages: uniqueMessages };
            }
            return { chatList };
          }),

        addPendingMessage: (chatId, message) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
              chatList[idx] = {
                ...chatList[idx],
                messages: [...message, ...(chatList[idx].messages || [])],
              };
            }
            return { chatList };
          }),

        updateUserStatus: (chatId, status) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
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
            }
            return { chatList };
          }),

        clearChatMessages: (chatId) =>
          set((state) => ({
            chatList: state.chatList.map((c) =>
              c.details.chat_id === chatId ? { ...c, messages: [] } : c
            ),
          })),

        deleteChatMessage: (chatId, messageId, soft) =>
          set((state) => ({
            chatList: state.chatList.map((c) => {
              if (c.details.chat_id !== chatId) return c;
              return {
                ...c,
                messages: soft
                  ? c.messages.filter((m) => m.message_id !== messageId)
                  : c.messages.map((m) =>
                      m.message_id === messageId
                        ? { ...m, deleted_at: new Date().toISOString() }
                        : m
                    ),
              };
            }),
          })),

        updateChatList: (data) => set(() => ({ chatList: data })),

        updateChatListDetails: (data) =>
          set((state) => ({
            chatList: state.chatList.map((c) =>
              c.details.chat_id === data.chat_id
                ? { ...c, details: { ...c.details, ...data } }
                : c
            ),
          })),

        addIncomingMessage: (chatId, message) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
              const merged = [...chatList[idx].messages, message].filter(
                (m, i, arr) =>
                  arr.findIndex((x) => x.message_id === m.message_id) === i
              );
              chatList[idx] = {
                ...chatList[idx],
                messages: merged.sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                ),
              };
            }
            return { chatList };
          }),

        updateMessageStatus: (chatId, messageId, status) =>
          set((state) => {
            const chatList = [...state.chatList];
            const idx = findChatIndex(chatList, chatId);
            if (idx !== -1) {
              chatList[idx] = {
                ...chatList[idx],
                messages: chatList[idx].messages.map((m) =>
                  m.message_id === messageId ? { ...m, status } : m
                ),
              };
            }
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
            chatList: state.chatList.filter(
              (c) => c.details.chat_id !== chatId
            ),
          })),

        resetChatStore: () => set(() => ({ chatList: [] })),

        hasChat: (chatId: string) =>
          get().chatList.some((c) => c.details.chat_id === chatId),
      };
    },
    {
      name: "top-notch-chatStorage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
