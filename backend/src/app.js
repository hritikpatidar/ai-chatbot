import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { redisClient } from "./config/redis.js";
import env from "./config/env.js";
const app = express();
// Middlewares
app.use(
  cors({
    origin: env.CLIENT_URL, // https://ai.chatbot.com
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use(notFound);
app.use(errorHandler);
// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Chatbot API Running 🚀",
  });
});


export default app;
