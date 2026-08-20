import { createClient } from "redis";
import env from "./env.js";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("🔄 Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis Connected & Ready");
});

redisClient.on("reconnecting", () => {
  console.log("🔁 Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("🔴 Redis connection closed");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    console.log("🚀 Redis connection successful");
  } catch (error) {
    console.error("❌ Redis Connection Failed:", error);
    throw error;
  }
};
