import env from "../config/env.js";
import transporter from "../config/mail.js";
import {
  clientWelcomeEmailTemplate,
  otpEmailTemplate,
} from "../helpers/emailTemplate.js";

export const sendOTPEmail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: "Your OTP Verification Code",
    html: otpEmailTemplate(otp),
  });
  console.log(`✅ Client OTP email sent to ${email}`, info.messageId);
};

export const sendClientWelcomeEmail = async ({
  fullName,
  businessName,
  email,
  password,
  slug,
}) => {
  try {
    const emailTemplate = clientWelcomeEmailTemplate({
      fullName,
      businessName,
      email,
      password,
      slug,
    });

    const info = await transporter.sendMail({
      from: `"AI Chatbot" <${env.MAIL_USER}>`,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log(`✅ Client welcome email sent to ${email}`, info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ Failed to send client welcome email to ${email}:`, error);

    throw error;
  }
};
