import { createServer } from "http";
import connectDB from "./db";
import express from "express";
import { apiRoute } from "./rest";
import { yoga } from "./graphql";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cookie from "cookie";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.143.57:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

connectDB();
app.use("/api", apiRoute);

app.use("/graphql", yoga);

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export const users: Record<string, string> = {};

export const getAllusers=()=>{
  return users
}

export const getUserSocketId = (userId: string): string | undefined => {
  return users[userId]; // Return socket ID if user is online
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    users[userId] = socket.id; // Store mapping
  }

  socket.on("disconnect", () => {
    delete users[userId];
  });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("GraphQL server running on http://localhost:4000/graphql");
});
