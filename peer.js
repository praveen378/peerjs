 // peer-server/peer.js
import express from "express";
import http from "http";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Set this to your actual deployed frontend domain
const CLIENT_URL = process.env.CLIENT_URL || "https://baatekare.netlify.app";

// ✅ CORS Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// ✅ PeerJS Headers Middleware (to prevent CORS preflight issues)
app.use("/peerjs", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight requests
  }
  next();
});

// ✅ Initialize PeerJS
const peerServer = ExpressPeerServer(server, {
  debug: false, // set to false for production
  path: "/",
});

app.use("/peerjs", peerServer);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 PeerJS Signaling Server is live in production");
});

// ✅ Start Server
const PORT = process.env.PEER_PORT || 3001;
server.listen(PORT, () => {
  console.log(`📡 PeerJS Server running at http://localhost:${PORT}/peerjs`);
});
