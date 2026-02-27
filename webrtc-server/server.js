
// to use the video and audio we have to reloadf the app like if we used video we need to reload the app to syatrt the audio one ig its due to audio 


const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const audioRooms = {};
const videoRooms = {}; // 🔥 NEW

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // =========================
  // VIDEO EVENTS
  // =========================

  socket.on("create-room", (callback) => {
    const roomId = Math.random().toString(36).substring(2, 8);

    videoRooms[roomId] = [];
    socket.join(`video-${roomId}`);
    videoRooms[roomId].push(socket.id);

    console.log("Video Room Created:", roomId);
    console.log("Video Room Users:", videoRooms[roomId]);

    if (callback) callback(roomId);
  });

  socket.on("join-room", (roomId) => {
    socket.join(`video-${roomId}`);

    if (!videoRooms[roomId]) {
      videoRooms[roomId] = [];
    }

    videoRooms[roomId].push(socket.id);

    console.log("User Joined Video Room:", roomId);
    console.log("Video Room Users:", videoRooms[roomId]);

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

    audioRooms[roomId] = [];
    socket.join(`audio-${roomId}`);
    audioRooms[roomId].push(socket.id);

    console.log("Audio Room Created:", roomId);
    console.log("Audio Room Users:", audioRooms[roomId]);

    if (callback) callback(roomId);
  });

  socket.on("join-audio-room", (roomId) => {
    socket.join(`audio-${roomId}`);

    if (!audioRooms[roomId]) {
      audioRooms[roomId] = [];
    }

    socket.emit(
      "audio-existing-users",
      audioRooms[roomId].filter((id) => id !== socket.id)
    );

    audioRooms[roomId].push(socket.id);

    console.log("Audio Room Users:", audioRooms[roomId]);
  });

  socket.on("audio-offer", ({ to, offer }) => {
    io.to(to).emit("audio-offer", {
      from: socket.id,
      offer,
    });
  });

  socket.on("audio-answer", ({ to, answer }) => {
    io.to(to).emit("audio-answer", {
      from: socket.id,
      answer,
    });
  });

  socket.on("audio-ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("audio-ice-candidate", {
      from: socket.id,
      candidate,
    });
  });

  socket.on("emoji-reaction", ({ roomId, emoji }) => {
    socket.to(`audio-${roomId}`).emit("emoji-reaction", { emoji });
  });

  socket.on("audio-leave", (roomId) => {
    if (audioRooms[roomId]) {
      audioRooms[roomId] = audioRooms[roomId].filter(
        (id) => id !== socket.id
      );
      socket.to(`audio-${roomId}`).emit(
        "audio-user-left",
        socket.id
      );
    }
  });

  socket.on("disconnect", () => {
    // Remove from video rooms
    for (const roomId in videoRooms) {
      videoRooms[roomId] = videoRooms[roomId].filter(
        (id) => id !== socket.id
      );
      socket.to(`video-${roomId}`).emit("user-left", socket.id);
    }

    // Remove from audio rooms
    for (const roomId in audioRooms) {
      audioRooms[roomId] = audioRooms[roomId].filter(
        (id) => id !== socket.id
      );
      socket.to(`audio-${roomId}`).emit(
        "audio-user-left",
        socket.id
      );
    }

    console.log("User disconnected:", socket.id);
  });
});

server.listen(5002, "0.0.0.0", () => {
  console.log("Server running on port 5002");
});