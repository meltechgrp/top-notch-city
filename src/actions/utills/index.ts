import { getAuthToken } from "@/lib/secureStore";
import config from "@/config";
import axios, { AxiosRequestConfig } from "axios";
import { getUniqueIdSync } from "react-native-device-info";
import { useEffect, useRef, useState } from "react";
import Platforms from "@/constants/Plaforms";
import eventBus from "@/lib/eventBus";
const MAPS_API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

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
  // console.log("Fetch URL:", url, "Response:", res.status, res.statusText);
  // if (res.status >= 400) {
  //   throw new Error(`HTTP error! status: ${res.status}`);
  // }
  return res.data;
}

export function useWebSocket() {
  const authToken = getAuthToken();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = () => {
    const wsUrl = `wss://app.topnotchcity.com/ws/?token=${authToken}`;
    console.log("🔌 Connecting to:", wsUrl);

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      reconnectAttempts.current = 0;

      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 Message:", data, data?.type);

        // if (data?.type == "new_message") {
        eventBus.dispatchEvent("REFRESH_CHAT", data?.chat_id);
        // updateChat(data a);
        // }
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
      console.log(`🔄 Attempting reconnect in ${timeout / 1000}s...`);
      reconnectTimeout.current = setTimeout(() => {
        reconnectAttempts.current += 1;
        connect();
      }, timeout);
    } else {
      console.warn("❌ Max reconnect attempts reached.");
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

export async function fetchPlaceFromTextQuery(
  query: string
): Promise<GooglePlace[]> {
  if (!query || query.trim().length === 0) return [];

  const endpoint = "https://places.googleapis.com/v1/places:searchText";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_API_KEY!,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.id,places.addressComponents",
      },
      body: JSON.stringify({
        textQuery: query,
      }),
    });

    if (!res.ok) {
      console.error("Google Places API error:", await res.text());
      return [];
    }

    const data = (await res.json()) as { places: GooglePlaceResult[] };
    return (
      data.places?.map((item) => {
        const getComponent = (type: string) =>
          item.addressComponents.find((comp) => comp.types.includes(type))
            ?.longText;
        return {
          displayName: item.displayName.text,
          placeId: item.id,
          location: item.location,
          addressComponents: {
            city: getComponent("locality"), // e.g., Port Harcourt
            state: getComponent("administrative_area_level_1"), // e.g., Rivers
            lga: getComponent("administrative_area_level_2"), // e.g., lga
            street: getComponent("administrative_area_level_3"), // e.g., lga
            country: getComponent("country"), // e.g., Nigeria
          },
        };
      }) || []
    );
  } catch (err) {
    console.error("Failed to fetch place:", err);
    return [];
  }
}

export async function updatePushNotificationToken(token: string) {
  try {
    const res = await Fetch(`/notifications/save-token/`, {
      method: "POST",
      data: { push_token: token },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
