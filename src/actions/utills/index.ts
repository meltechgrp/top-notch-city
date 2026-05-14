import { getActiveToken } from "@/lib/secureStore";
import config from "@/config";
import { getUniqueIdSync } from "react-native-device-info";
import { useEffect, useRef, useState } from "react";

type FetchOptions = {
  method?: string;
  headers?: HeadersInit;
  data?: any;
  withAuth?: boolean;
};

export class ApiError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const value =
    error instanceof ApiError
      ? error.body
      : error instanceof Error
        ? error.message
        : error;

  if (typeof value === "string") {
    try {
      return getApiErrorMessage(JSON.parse(value), fallback);
    } catch {
      return value.replace(/^Error:\s*/i, "").trim() || fallback;
    }
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => getApiErrorMessage(item, ""))
      .filter(Boolean)
      .join("\n");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, any>;
    const detail = record.detail ?? record.message ?? record.error;

    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return getApiErrorMessage(detail, fallback);
    if (detail && typeof detail === "object") {
      return Object.entries(detail)
        .map(([field, message]) => {
          const text = Array.isArray(message) ? message.join(", ") : message;
          return `${field}: ${String(text)}`;
        })
        .join("\n");
    }

    const first = Object.values(record).find(Boolean);
    if (first) return getApiErrorMessage(first, fallback);
  }

  return fallback;
}

export async function Fetch(url: string, options: FetchOptions = {}) {
  const authToken = await getActiveToken();
  const deviceId = getUniqueIdSync();
  // @ts-ignore
  const contentType = options.headers?.["Content-Type"] ?? "application/json";
  let body;

  if (options.data && options.method !== "GET") {
    if (isFormData(options.data)) {
      body = options.data;
    } else if (contentType === "application/x-www-form-urlencoded") {
      const params = new URLSearchParams();
      Object.entries(options.data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });
      body = params.toString();
    } else {
      body = JSON.stringify(options.data);
    }
  }

  const headers: Record<string, string> = {
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    "X-DID": deviceId,
    ...(options.headers as Record<string, string> | undefined),
  };

  if (isFormData(body)) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = contentType;
  }

  const response = await fetch(`${config.origin}/api${url}`, {
    method: options.method ?? "GET",
    headers,
    body: body,
  });

  console.log("Fetch URL:", url, "Response:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    let errorBody: unknown = errorText;

    try {
      errorBody = JSON.parse(errorText);
    } catch {}

    throw new ApiError(
      getApiErrorMessage(errorBody, `Request failed: ${response.status}`),
      response.status,
      errorBody,
    );
  }

  // auto-handle empty responses
  const contentTypes = response.headers.get("content-type");

  if (contentTypes?.includes("application/json")) {
    return response.json();
  }

  return response.text();
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
    // if (ws.current?.readyState === WebSocket.OPEN) {
    //   ws.current.send(JSON.stringify(msg));
    // } else {
    //   console.warn("⚠️ WebSocket is not open, message not sent.");
    // }
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
  query: string,
): Promise<OSMPlace[]> {
  if (!query || query.trim().length === 0) return [];

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    query,
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
  query: string,
): Promise<GooglePlace[]> {
  // Google Places API disabled: switched to OpenStreetMap (Nominatim) to avoid billing.
  return fetchPlaceFromTextQuery(query);

  // if (!query || query.trim().length === 0) return [];
  //
  // const endpoint = "https://places.googleapis.com/v1/places:searchText";
  //
  // try {
  //   const res = await fetch(endpoint, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-Goog-Api-Key": "AIzaSyCi6UmiBotzTMWS9NTg9vkMBaID7MYZ2i0",
  //       "X-Goog-FieldMask":
  //         "places.displayName,places.formattedAddress,places.location,places.id,places.addressComponents",
  //     },
  //     body: JSON.stringify({
  //       textQuery: query,
  //     }),
  //   });
  //
  //   if (!res.ok) {
  //     console.error("Google Places API error:", await res.text());
  //     return [];
  //   }
  //
  //   const data = (await res.json()) as { places: GooglePlaceResult[] };
  //   return (
  //     data.places?.map((item) => {
  //       const getComponent = (type: string) =>
  //         item.addressComponents.find((comp) => comp?.types?.includes(type))
  //           ?.longText;
  //       return {
  //         displayName: item.formattedAddress,
  //         placeId: item.id,
  //         location: item.location,
  //         addressComponents: {
  //           city: getComponent("locality"),
  //           state: getComponent("administrative_area_level_1"),
  //           lga: getComponent("administrative_area_level_2"),
  //           street: getComponent("administrative_area_level_3"),
  //           country: getComponent("country"),
  //         },
  //       };
  //     }) || []
  //   );
  // } catch (err) {
  //   console.error("Failed to fetch place:", err);
  //   return [];
  // }
}
