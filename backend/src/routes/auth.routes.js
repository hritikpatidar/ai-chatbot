import express from "express";
import {
  forgotPassword,
  login,
  logout,
  resendOTP,
  resetPassword,
  signup,
  verifyEmailOTP,
  changePassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email-otp", verifyEmailOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.post("/logout", logout);

export default router;
