import { redisClient } from "../config/redis.js";

const OTP_EXPIRY = 10 * 60;

export const saveOTP = async (email, purpose, otp) => {
  const key = `otp:${purpose}:${email}`;

  await redisClient.set(key, otp, {
    EX: OTP_EXPIRY,
  });
};

export const getOTP = async (email, purpose) => {
  const key = `otp:${purpose}:${email}`;

  return await redisClient.get(key);
};

export const deleteOTP = async (email, purpose) => {
  const key = `otp:${purpose}:${email}`;

  await redisClient.del(key);
};
