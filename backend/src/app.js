import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import clientRoutes from "./routes/client.routes.js";
import productRoutes from "./routes/product.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminRoutes from "./routes/admin.route.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { redisClient } from "./config/redis.js";
import env from "./config/env.js";
import path from "path";

const app = express();
// Middlewares
app.use(
  cors({
    origin: [env.CLIENT_URL, "https://my-ai-chatbot-project.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(compression());
app.use(morgan("dev"));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));
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
