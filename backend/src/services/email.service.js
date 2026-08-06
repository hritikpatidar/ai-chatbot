import env from "../config/env.js";
import transporter from "../config/mail.js";
import { otpEmailTemplate } from "../helpers/emailTemplate.js";

export const sendOTPEmail = async (email, otp) => {
  console.log("=================================");
  console.log("Email :", email);
  console.log("OTP   :", otp);
  console.log("=================================");
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: "Your OTP Verification Code",
    html: otpEmailTemplate(otp),
  });
};
