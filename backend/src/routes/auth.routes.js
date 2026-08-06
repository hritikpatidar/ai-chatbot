import express from "express";
import { forgotPassword, login, logout, resendOTP, resetPassword, signup, verifyEmailOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email-otp", verifyEmailOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/login", login);
router.post("/reset-password", resetPassword);
// router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
