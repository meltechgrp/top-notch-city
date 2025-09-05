import { getAuthToken } from "@/lib/secureStore";
import config from "@/config";
import axios, { AxiosRequestConfig } from "axios";
import { getUniqueIdSync } from "react-native-device-info";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "@/hooks/useChat";
import { useHomeFeed } from "@/hooks/useHomeFeed";

export async function Fetch(url: string, options: AxiosRequestConfig = {}) {
  const authToken = getAuthToken();
  const deviceId = getUniqueIdSync();
  const res = await axios({
    baseURL: `${config.origin}/api`,
    url,
    method: options.method || "GET",
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      "X-DID": deviceId,
      ...options.headers,
    },
    data: options.data,
  });
  return res.data;
}

export function useWebSocket() {
  const authToken = getAuthToken();
  const { addIncomingMessage, updateMessageStatus, updateMessage } =
    useChatStore.getState();
  const { getTotalCount } = useHomeFeed();
  const { refetch } = useChat();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connect = () => {
    if (!authToken) return;
    const wsUrl = `wss://app.topnotchcity.com/ws/?token=${authToken}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      reconnectAttempts.current = 0;

      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const raw = event.data;
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;

        // const data = event.data;
        console.log("📨 Message:", data, data?.type);

        switch (data.type) {
          case "new_message":
            addIncomingMessage(data.chat_id, {
              message_id: data?.message_id!,
              created_at: data?.created_at,
              updated_at: data?.created_at,
              content: data?.content,
              sender_info: {
                id: data?.sender_id,
                first_name: "",
                last_name: "",
                profile_image: "",
                status: "offline",
              },
              status: data?.status,
              file_data: data?.media?.map((f: any) => ({
                file_id: f.id,
                file_url: f.file_url,
                file_type: f.file_type,
                file_name: f.file_name,
              })),
              read: data?.read,
            });
            break;

          case "read_receipt":
            updateMessageStatus(data.chat_id, data.message_id, "seen");
            break;

          case "message_edited":
            updateMessage(data.chat_id, data.message_id, data.content);
            break;
          case "unread_count_update":
            refetch();
            getTotalCount();
            break;
        }
      } catch (err) {
        console.error("❌ Failed to parse message:", event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("🚪 WebSocket closed:", event.reason);
      setIsConnected(false);
      attemptReconnect();
    };

    ws.current = socket;
  };

  const attemptReconnect = () => {
    const maxAttempts = 5;
    if (reconnectAttempts.current < maxAttempts) {
      const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 30000); // exponential backoff, max 30s
      reconnectTimeout.current = setTimeout(() => {
        reconnectAttempts.current += 1;
        connect();
      }, timeout);
    }
  };

  useEffect(() => {
    return () => {
      reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
    };
  }, []);
  const closeConnection = () => {
    reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
    ws.current?.close();
  };
  const sendMessage = (msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ WebSocket is not open, message not sent.");
    }
  };

  return { connect, sendMessage, isConnected, closeConnection };
}

export async function updatePushNotificationToken(token: string) {
  try {
    const res = await Fetch(`/notifications/save-token/`, {
      method: "POST",
      data: { push_token: token },
    });
    return res;
  } catch (error) {}
}

export interface OSMPlace {
  displayName: string;
  placeId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  addressComponents: {
    city?: string;
    state?: string;
    lga?: string;
    street?: string;
    country?: string;
  };
}

export async function fetchPlaceFromTextQuery(
  query: string
): Promise<OSMPlace[]> {
  if (!query || query.trim().length === 0) return [];

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    query
  )}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent": "topnotchapp/1.0 meltechnologiessolution@gmail.com", // required by OSM
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as any[];

    return data.map((item) => {
      const address = item.address || {};
      return {
        displayName: item.display_name,
        placeId: item.place_id.toString(),
        location: {
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        },
        addressComponents: {
          city: address.city || address.town || address.village,
          state: address.state,
          lga: address.county,
          street: address.road,
          country: address.country,
        },
      };
    });
  } catch (err) {
    return [];
  }
}
