import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRE || "15m",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRE || "7d",
  });
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw error;
  }
};
