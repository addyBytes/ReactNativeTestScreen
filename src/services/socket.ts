import { io } from "socket.io-client";

const socket = io("https://inequilateral-hilda-nonfeloniously.ngrok-free.dev", {
  transports: ["websocket"],
  forceNew: true,
});

socket.on("connect", () => {
  console.log("✅ CONNECTED TO SERVER:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ CONNECTION ERROR:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ DISCONNECTED:", reason);
});

export default socket;