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

  // ✅ ADD THIS
  socket.on("create-room", (callback) => {
    console.log("create-room received");

    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(roomId);

    console.log("Room created:", roomId);

    if (callback) {
      callback(roomId);
    }
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
    console.log("User joined room:", roomId);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
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