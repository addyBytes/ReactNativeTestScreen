const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // =========================
  // VIDEO EVENTS
  // =========================

  socket.on("create-room", (callback) => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(`video-${roomId}`);
    if (callback) callback(roomId);
  });

  socket.on("join-room", (roomId) => {
    socket.join(`video-${roomId}`);
    socket.to(`video-${roomId}`).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(`video-${roomId}`).emit("offer", { offer });
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(`video-${roomId}`).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(`video-${roomId}`).emit("ice-candidate", { candidate });
  });

  // =========================
  // AUDIO EVENTS
  // =========================

  socket.on("create-audio-room", (callback) => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(`audio-${roomId}`);
    if (callback) callback(roomId);
  });

  socket.on("join-audio-room", (roomId) => {
    socket.join(`audio-${roomId}`);
    socket.to(`audio-${roomId}`).emit("audio-user-joined");
  });

  socket.on("audio-offer", ({ roomId, offer }) => {
    console.log("Forwarding AUDIO OFFER");
    socket.to(`audio-${roomId}`).emit("audio-offer", { offer });
  });

  socket.on("audio-answer", ({ roomId, answer }) => {
    console.log("Forwarding AUDIO ANSWER");
    socket.to(`audio-${roomId}`).emit("audio-answer", { answer });
  });

  socket.on("audio-ice-candidate", ({ roomId, candidate }) => {
    socket.to(`audio-${roomId}`).emit("audio-ice-candidate", { candidate });
  });

  // =========================
  // ✅ EMOJI REACTIONS (FIXED)
  // =========================

  socket.on("emoji-reaction", ({ roomId, emoji }) => {
    // console.log("Emoji received:", emoji);

    // Send to everyone else in same audio room
    socket.to(`audio-${roomId}`).emit("emoji-reaction", { emoji });
  });

  socket.on("audio-speaking", (roomId) => {
    socket.to(`audio-${roomId}`).emit("audio-speaking");
  });

  socket.on("audio-leave", (roomId) => {
    socket.leave(`audio-${roomId}`);
    socket.to(`audio-${roomId}`).emit("audio-ended");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5002, "0.0.0.0", () => {
  console.log("Server running on port 5002");
});

app.get("/", (req, res) => {
  res.send("Server is reachable");
});