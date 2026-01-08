import { io } from "socket.io-client";

export const socket = io("https://api-rangga-circle.liera.my.id", {
  withCredentials: true,
});
