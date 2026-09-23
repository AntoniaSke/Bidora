import { Server } from "socket.io";

let io: Server | null = null;

export function setSocketServer(
  socketServer: Server
) {
  io = socketServer;
}

export function getSocketServer() {
  if (!io) {
    throw new Error(
      "Socket.io has not been initialized."
    );
  }

  return io;
}