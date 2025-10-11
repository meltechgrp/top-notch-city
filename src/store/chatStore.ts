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

  // Actions
  updateChatMessages: (chatId: string, newMessages: Message[]) => void;
  addPendingMessage: (chatId: string, newMessage: Message[]) => void;
  clearChatMessages: (chatId: string) => void;
  deleteChatMessage: (chatId: string, messageId: string, soft: boolean) => void;
  updateChatList: (data: ChatList[]) => void;
  updateChatListDetails: (data: ChatList["details"]) => void;
  deleteChat: (chatId: string) => void;
  setTyping: (chatId: string, typing: boolean) => void;
  getTyping: (chatId: string) => boolean;
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
};

type MyChatPersist = (
  config: StateCreator<ChatState>,
  options: PersistOptions<ChatState>
) => StateCreator<ChatState>;

export const useChatStore = create<ChatState>(
  (persist as MyChatPersist)(
    (set, get) => ({
      chatList: [],

      /** --- GETTERS --- */
      getSender: (chatId) => {
        return get().chatList.find((c) => c.details.chat_id === chatId)?.details
          .sender_id;
      },

      getReceiver: (chatId) => {
        return get().chatList.find((c) => c.details.chat_id === chatId)?.details
          .receiver;
      },
      getTyping: (chatId) => {
        return !!get().chatList.find((c) => c.details.chat_id === chatId)
          ?.typing;
      },
      getMessages: (chatId) => {
        return (
          get().chatList.find((c) => c.details.chat_id === chatId)?.messages ||
          []
        );
      },
      getMessage: (chatId) => {
        return (
          get().chatList.find((c) => c.details.chat_id === chatId)
            ?.messages[0] || null
        );
      },
      getChatList: () => {
        return get().chatList.map((l) => l.details) || [];
      },

      /** --- ACTIONS --- */
      updateMessage: (chatId, messageId, content) => {
        set((state) => {
          const chatList = [...state.chatList];
          const idx = chatList.findIndex((c) => c.details.chat_id === chatId);

          if (idx !== -1) {
            chatList[idx] = {
              ...chatList[idx],
              messages: chatList[idx].messages.map((m) =>
                m.message_id === messageId
                  ? {
                      ...m,
                      content,
                      updated_at: new Date(Date.now()).toString(),
                    }
                  : m
              ),
            };
          }
          return { chatList };
        });
      },
      replaceMockMessage: (chatId, tempId, newMessage) => {
        set((state) => {
          const chatList = [...state.chatList];
          const index = chatList.findIndex((c) => c.details.chat_id === chatId);

          if (index !== -1) {
            const existingMessages = chatList[index].messages || [];

            const updatedMessages = existingMessages.map((msg) =>
              msg.message_id === tempId ? { ...msg, ...newMessage } : msg
            );

            chatList[index] = {
              ...chatList[index],
              messages: updatedMessages,
            };
          }

          return { chatList };
        });
      },
      updateChatMessages: (chatId, newMessages) => {
        set((state) => {
          const chatList = [...state.chatList];
          const index = chatList.findIndex((c) => c.details.chat_id === chatId);

          if (index !== -1) {
            // const existingMessages = chatList[index].messages || [];

            // // Merge messages (prioritize new ones)
            // const merged = [...existingMessages, ...newMessages];

            // // Remove duplicates based on message_id (keep latest)
            // const uniqueMap = new Map();
            // for (const msg of merged) {
            //   uniqueMap.set(msg.message_id, msg);
            // }

            // const uniqueMessages = Array.from(uniqueMap.values());

            // // Sort by created_at (oldest → newest)
            // uniqueMessages.sort(
            //   (a, b) =>
            //     new Date(b.created_at).getTime() -
            //     new Date(a.created_at).getTime()
            // );

            chatList[index] = {
              ...chatList[index],
              messages: newMessages,
            };
          }

          return { chatList };
        });
      },
      addPendingMessage: (chatId, message) => {
        set((state) => {
          const chatList = state.chatList ? [...state.chatList] : [];
          const index = chatList.findIndex(
            (c) => String(c.details.chat_id) === String(chatId)
          );

          if (index !== -1) {
            chatList[index] = {
              ...chatList[index],
              messages: [...message, ...(chatList[index].messages || [])],
            };
          }
          return { chatList };
        });
      },
      updateUserStatus: (chatId, status) => {
        set((state) => {
          if (!state.chatList) return {};

          const index = state.chatList.findIndex(
            (c) => String(c.details.chat_id) === String(chatId)
          );
          if (index === -1) return {};

          const chatList = [...state.chatList];
          chatList[index] = {
            ...chatList[index],
            details: {
              ...chatList[index].details,
              receiver: {
                ...(chatList[index].details.receiver ?? {}),
                status,
              },
            },
          };

          return { chatList };
        });
      },
      clearChatMessages: (chatId) => {
        set((state) => ({
          chatList: state.chatList.map((c) =>
            c.details.chat_id === chatId ? { ...c, messages: [] } : c
          ),
        }));
      },

      deleteChatMessage: (chatId, messageId, soft) => {
        set((state) => ({
          chatList: state.chatList.map((c) => {
            if (soft) {
              return c.details.chat_id === chatId
                ? {
                    ...c,
                    messages: c.messages.filter(
                      (m) => m.message_id !== messageId
                    ),
                  }
                : c;
            } else {
              return c.details.chat_id === chatId
                ? {
                    ...c,
                    messages: c.messages.map((m) => {
                      if (m.message_id == messageId) {
                        return {
                          ...m,
                          deleted_at: new Date(Date.now()).toString(),
                        };
                      } else {
                        return m;
                      }
                    }),
                  }
                : c;
            }
          }),
        }));
      },

      updateChatList: (data) => {
        set((state) => {
          // const exists = state.chatList.find(
          //   (c) => c.details.chat_id === data.details.chat_id
          // );

          // if (exists) {
          //   // Update existing chat details
          //   return {
          //     chatList: state.chatList.map((c) =>
          //       c.details.chat_id === data.details.chat_id
          //         ? { ...c, ...data }
          //         : c
          //     ),
          //   };
          // } else {
          // Add new chat
          return { chatList: data };
          // }
        });
      },
      updateChatListDetails: (data) => {
        set((state) => {
          const exists = state.chatList.find(
            (c) => c.details.chat_id === data.chat_id
          );
          if (exists) {
            return {
              chatList: state.chatList.map((c) =>
                c.details.chat_id === data.chat_id
                  ? { ...c, details: { ...c.details, ...data } }
                  : c
              ),
            };
          } else {
            // Add new chat
            return state;
          }
        });
      },
      addIncomingMessage: (chatId, message) => {
        set((state) => {
          const chatList = [...state.chatList];
          const idx = chatList.findIndex((c) => c.details.chat_id === chatId);

          if (idx !== -1) {
            // merge and avoid duplicates
            const existing = chatList[idx].messages;
            const merged = [...existing, message].filter(
              (m, i, arr) =>
                arr.findIndex((x) => x.message_id === m.message_id) === i
            );

            chatList[idx] = {
              ...chatList[idx],
              messages: merged.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              ),
            };
          }
          return { chatList };
        });
      },
      updateMessageStatus: (chatId, messageId, status) => {
        set((state) => {
          const chatList = [...state.chatList];
          const idx = chatList.findIndex((c) => c.details.chat_id === chatId);

          if (idx !== -1) {
            chatList[idx] = {
              ...chatList[idx],
              messages: chatList[idx].messages.map((m) => {
                if (m.message_id === messageId) {
                  return { ...m, status };
                }
                return m;
              }),
            };
          }
          return { chatList };
        });
      },

      setTyping: (chatId, typing) => {
        set((state) => ({
          chatList: state.chatList.map((c) =>
            c.details.chat_id === chatId ? { ...c, typing } : c
          ),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chatList: state.chatList.filter((c) => c.details.chat_id !== chatId),
        }));
      },
      resetChatStore: () => set(() => ({ chatList: [] })),
      hasChat: (chatId: string) => {
        return get().chatList.some((c) => c.details.chat_id === chatId);
      },
    }),
    {
      name: "top-notch-chatStorage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
