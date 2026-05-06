import { Server } from "socket.io";
import express from "express";
import  http from "http";
import WebRTCServer from "../webrtc/wsServer.js";

const app= express();

const server = http.createServer(app);
WebRTCServer(server);
const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
 
  pingInterval: 25000,
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    // emit only to users in the room
    io.to(data.roomId).emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export {app, server, io};


