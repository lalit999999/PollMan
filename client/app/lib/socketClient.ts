import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "../services/runtimeConfig";

let socket: Socket | null = null;

function getSocketUrl() {
  // API_BASE_URL is like http://localhost:3300/api -> remove /api to get server root
  return API_BASE_URL.replace(/\/api$/, "");
}

export function connectSocket(accessToken?: string) {
  if (socket && socket.connected) return socket;

  const url = getSocketUrl();

  socket = io(url, {
    // pass token if available (server may use it to join rooms)
    auth: accessToken ? { token: accessToken } : undefined,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    // console.debug("socket connected", socket?.id);
  });

  socket.on("disconnect", () => {
    // console.debug("socket disconnected");
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
