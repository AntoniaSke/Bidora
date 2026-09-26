import { API_URL } from "@/lib/api";
import { io } from "socket.io-client";

export const socket = io(
  `${API_URL}`,
  {
    withCredentials: true,
    autoConnect: false,
  }
);