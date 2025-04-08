// peer-server/peer.js
import express from "express";
import http from "http";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // 👈 change this to your frontend

// CORS Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// PeerJS Headers Middleware
app.use("/peerjs", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// PeerJS Server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
});

app.use("/peerjs", peerServer);

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 PeerJS Server is running");
});

// Start server
const PORT = process.env.PEER_PORT || 3001;
server.listen(PORT, () => {
  console.log(`📡 PeerJS Server running at http://localhost:${PORT}/peerjs`);
});
