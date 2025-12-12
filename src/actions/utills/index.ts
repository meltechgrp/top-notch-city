import { getActiveToken } from "@/lib/secureStore";
import config from "@/config";
import axios, { AxiosRequestConfig } from "axios";
import { getUniqueIdSync } from "react-native-device-info";
import { useEffect, useRef, useState } from "react";

export async function Fetch(url: string, options: AxiosRequestConfig = {}) {
  try {
    const authToken = await getActiveToken();
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
  } catch (error: any) {
    throw error;
  }
}
export function useWebSocketConnection(url: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subscribers = useRef<Array<(data: any) => void>>([]);

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
      scheduleReconnect();
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        ws.current?.send("pong");
        subscribers.current.forEach((handler) => handler(data));
      } catch {
        console.error("❌ Failed to parse message:", event.data);
      }
    };

    ws.current = socket;
  };

  const scheduleReconnect = () => {
    const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 30000); // exponential backoff capped at 30s
    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts.current += 1;
      connect();
    }, timeout);
  };

  const closeConnection = () => {
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    if (pingInterval.current) clearInterval(pingInterval.current);
    ws.current?.close();
  };

  const sendMessage = (msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ WebSocket is not open, message not sent.");
    }
  };

  const setOnMessage = (handler: (data: any) => void) => {
    subscribers.current.push(handler);
  };

  useEffect(() => {
    if (isConnected && ws.current) {
      pingInterval.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "ping" }));
        }
      }, 25000);
    }
    return () => {
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
  }, [isConnected]);

  useEffect(() => {
    return () => {
      closeConnection();
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
        "User-Agent": "topnotchapp/1.0 meltechnologiessolution@gmail.com",
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

export async function fetchPlaceFromTextQueryGoogle(
  query: string
): Promise<GooglePlace[]> {
  if (!query || query.trim().length === 0) return [];

  const endpoint = "https://places.googleapis.com/v1/places:searchText";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyCi6UmiBotzTMWS9NTg9vkMBaID7MYZ2i0",
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
          item.addressComponents.find((comp) => comp?.types?.includes(type))
            ?.longText;
        return {
          displayName: item.formattedAddress,
          placeId: item.id,
          location: item.location,
          addressComponents: {
            city: getComponent("locality"),
            state: getComponent("administrative_area_level_1"),
            lga: getComponent("administrative_area_level_2"),
            street: getComponent("administrative_area_level_3"),
            country: getComponent("country"),
          },
        };
      }) || []
    );
  } catch (err) {
    console.error("Failed to fetch place:", err);
    return [];
  }
}
