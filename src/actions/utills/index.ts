import { getAuthToken } from "@/lib/secureStore";
import config from "@/config";
import axios, { AxiosRequestConfig } from "axios";
import { getUniqueIdSync } from "react-native-device-info";
import { useEffect, useRef, useState } from "react";

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

export function useWebSocketConnection(url: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribers = useRef<((data: any) => void)[]>([]);
  const pingInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = () => {
    if (!url) return;

    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      reconnectAttempts.current = 0;
      setIsConnected(true);
    };

    socket.onclose = (event) => {
      console.log("🚪 WebSocket closed:", event.reason);
      setIsConnected(false);
      attemptReconnect();
    };

    socket.onerror = (error) => {
      // console.error("❌ WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        ws.current?.send("pong");
        subscribers.current.forEach((h) => h(data));
      } catch (err) {
        console.error("❌ Failed to parse message:", event.data);
      }
    };
    ws.current = socket;
  };

  const attemptReconnect = () => {
    const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts.current += 1;
      connect();
    }, timeout);
  };

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

  // const setOnMessage = (handler: (data: any) => void) => {
  //   if (!ws.current) return;
  //   ws.current.onmessage = (event) => {
  //     try {
  //       const raw = event.data;
  //       const data = typeof raw === "string" ? JSON.parse(raw) : raw;

  //       ws.current?.send("pong");
  //       handler(data);
  //     } catch (err) {
  //       console.error("❌ Failed to parse message:", event.data);
  //     }
  //   };
  // };
  const setOnMessage = (handler: (data: any) => void) => {
    subscribers.current.push(handler);
  };

  useEffect(() => {
    if (isConnected && ws.current) {
      pingInterval.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "ping" }));
        }
      }, 25000); // every 25s
    }

    return () => {
      pingInterval.current && clearInterval(pingInterval.current);
    };
  }, [isConnected]);
  useEffect(() => {
    return () => {
      reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, []);

  return { connect, closeConnection, sendMessage, setOnMessage, isConnected };
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
