import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
});

try {
  await transporter.verify();
  console.log("✅ SMTP Connected");
} catch (err) {
  console.error(err);
}

export default transporter;