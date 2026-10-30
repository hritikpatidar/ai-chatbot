import express from "express";

import {
  getClientConfig,
  getClientById,
  updateClient,
} from "../controllers/client.controller.js";

import authMiddleware from "../middlewares/auth.js";
import { createSupportTicket, getMySupportTickets } from "../controllers/supportTicket.controller.js";
import { getUsageAnalytics } from "../controllers/usageAnalytics.controller.js";
import {
  getAnalyticsOverview,
  getConversationsChart,
  getConversationSources,
  getPopularTopics,
  getRecentConversations,
  getUserActivity,
  getUserSatisfaction,
} from "../controllers/clientAnalytics.controller.js";

const router = express.Router();

// Client Support Ticket APIs
router.post("/support-ticket", authMiddleware, createSupportTicket);
router.get("/client-support-tickets", authMiddleware, getMySupportTickets);

//dashboard APIs
router.get("/usage-analytics", authMiddleware, getUsageAnalytics);

//analytices APIs
router.get("/analytics/overview", authMiddleware, getAnalyticsOverview);
router.get("/analytics/conversations", authMiddleware, getConversationsChart);
router.get("/analytics/user-activity", authMiddleware, getUserActivity);
router.get("/analytics/sources", authMiddleware, getConversationSources);
router.get("/analytics/topics", authMiddleware, getPopularTopics);
router.get("/analytics/satisfaction", authMiddleware, getUserSatisfaction);
router.get("/analytics/recent-conversations", authMiddleware, getRecentConversations);

// Client APIs
router.get("/:clientId", authMiddleware, getClientById);
router.patch("/:clientId", authMiddleware, updateClient);
router.get("/config/:clientKey", getClientConfig);


export default router;
