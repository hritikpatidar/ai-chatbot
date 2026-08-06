import { generateOTP } from "../helpers/otp.js";
import { saveOTP } from "../helpers/redisOTP.js";
import { sendOTPEmail } from "./email.service.js";

export const sendOTPService = async (email, purpose) => {
  const otp = generateOTP();
  await saveOTP(email, purpose, otp);
  sendOTPEmail(email, otp).catch((err) => {
    console.error("Email Error:", err);
  });
};