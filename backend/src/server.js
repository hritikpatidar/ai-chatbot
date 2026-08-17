import http from "http";
import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import env from "./config/env.js";
import { socketHandler } from "./socket/socketHandler.js";
import { initializeSocket } from "./config/socket.js";


const PORT = env.PORT || 5000;
const server = http.createServer(app);

const io = initializeSocket(server);

socketHandler(io);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
