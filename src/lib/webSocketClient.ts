type Handler = (data: any) => void;

type State = {
  socket: WebSocket | null;
  url: string | null;
  isConnected: boolean;
  reconnectAttempts: number;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  pingTimer: ReturnType<typeof setInterval> | null;
  manuallyClosed: boolean;
};

const state: State = {
  socket: null,
  url: null,
  isConnected: false,
  reconnectAttempts: 0,
  reconnectTimer: null,
  pingTimer: null,
  manuallyClosed: false,
};

const subscribers = new Set<Handler>();
const statusListeners = new Set<(connected: boolean) => void>();

function setConnected(v: boolean) {
  if (state.isConnected === v) return;
  state.isConnected = v;
  statusListeners.forEach((cb) => cb(v));
}

function clearTimers() {
  if (state.reconnectTimer) {
    clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;
  }
  if (state.pingTimer) {
    clearInterval(state.pingTimer);
    state.pingTimer = null;
  }
}

function scheduleReconnect() {
  if (state.manuallyClosed) return;
  const delay = Math.min(1000 * 2 ** state.reconnectAttempts, 30000);
  state.reconnectTimer = setTimeout(() => {
    state.reconnectAttempts += 1;
    openSocket();
  }, delay);
}

function openSocket() {
  if (!state.url) return;
  if (
    state.socket &&
    (state.socket.readyState === WebSocket.OPEN ||
      state.socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  const socket = new WebSocket(state.url);
  state.socket = socket;
  state.manuallyClosed = false;

  socket.onopen = () => {
    state.reconnectAttempts = 0;
    setConnected(true);

    if (state.pingTimer) clearInterval(state.pingTimer);
    state.pingTimer = setInterval(() => {
      if (state.socket?.readyState === WebSocket.OPEN) {
        state.socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 25000);
  };

  socket.onclose = () => {
    setConnected(false);
    if (state.pingTimer) {
      clearInterval(state.pingTimer);
      state.pingTimer = null;
    }
    scheduleReconnect();
  };

  socket.onerror = () => {
    // onclose will run right after, handle reconnect there
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data?.type === "ping") {
        if (state.socket?.readyState === WebSocket.OPEN) {
          state.socket.send(JSON.stringify({ type: "pong" }));
        }
        return;
      }
      subscribers.forEach((handler) => handler(data));
    } catch {
      // ignore malformed frames
    }
  };
}

export function connectWebSocket(url: string) {
  if (state.url === url && state.socket) return;
  if (state.url && state.url !== url) {
    disconnectWebSocket();
  }
  state.url = url;
  state.reconnectAttempts = 0;
  openSocket();
}

export function disconnectWebSocket() {
  state.manuallyClosed = true;
  clearTimers();
  if (state.socket) {
    state.socket.onopen = null;
    state.socket.onclose = null;
    state.socket.onerror = null;
    state.socket.onmessage = null;
    state.socket.close();
    state.socket = null;
  }
  state.url = null;
  setConnected(false);
}

export function subscribeWebSocket(handler: Handler): () => void {
  subscribers.add(handler);
  return () => subscribers.delete(handler);
}

export function subscribeWebSocketStatus(
  cb: (connected: boolean) => void
): () => void {
  statusListeners.add(cb);
  cb(state.isConnected);
  return () => statusListeners.delete(cb);
}

export function sendWebSocketMessage(msg: any) {
  if (state.socket?.readyState === WebSocket.OPEN) {
    state.socket.send(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
}

export function isWebSocketConnected() {
  return state.isConnected;
}
