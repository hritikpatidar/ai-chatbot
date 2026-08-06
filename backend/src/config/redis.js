import { createClient } from "redis";
import env from "./env.js";

let redisClient;

export const connectRedis = async () => {
  redisClient = createClient({
    url: env.REDIS_URL,
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
  });

  redisClient.on("ready", () => {
    console.log("🚀 Redis Ready");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err.message);
  });

  await redisClient.connect();
};

export { redisClient };