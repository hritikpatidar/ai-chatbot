import crypto from "crypto";
import AdminSetting from "../models/adminSetting.model.js";
import Client from "../models/Client.js";
import User from "../models/User.js";
import { redisClient } from "../config/redis.js";
import {
  UserFindByEmail,
  userCreate,
  verifyUserEmail,
  userFindByEmailWithPassword,
  updateLastLogin,
  userUpdatePassword,
  userFindByIdWithPassword,
  UserFindById,
  findUserForRefreshToken,
  updateUserProfile,
} from "../repositories/user.repository.js";

import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { generateOTP } from "../helpers/otp.js";

import { sendOTPEmail } from "./email.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../helpers/jwt.js";
import {
  createRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
  findRefreshTokenByUserId,
  updateRefreshToken,
} from "../repositories/refreshToken.repository.js";
import { deleteOTP, getOTP, saveOTP } from "../helpers/redisOTP.js";
import { sendOTPService } from "./otp.service.js";

const LOGIN_LOCKOUT_SECONDS = 15 * 60;
const TWO_FACTOR_CHALLENGE_SECONDS = 10 * 60;
const TWO_FACTOR_MAX_ATTEMPTS = 5;

const createAuthError = (message, statusCode, details = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

const getClientMaxLoginAttempts = async (user) => {
  const client = user.clientId
    ? await Client.findById(user.clientId).select("adminId").lean()
    : null;
  let adminId = client?.adminId;

  if (!adminId) {
    const primaryAdmin = await User.findOne({ role: "admin" })
      .sort({ createdAt: 1 })
      .select("_id")
      .lean();
    adminId = primaryAdmin?._id;
  }

  if (!adminId) {
    return 5;
  }

  const settings = await AdminSetting.findOne({ adminId })
    .select("maxLoginAttempts")
    .lean();
  return settings?.maxLoginAttempts ?? 5;
};

const createUserSession = async (user, fcmToken) => {
  const payload = {
    id: user._id,
    clientId: user?.clientId,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const existingRefreshToken = await findRefreshTokenByUserId(user._id);

  if (existingRefreshToken) {
    await updateRefreshToken(user._id, { refreshToken, expiresAt });
  } else {
    await createRefreshToken({
      userId: user._id,
      refreshToken,
      expiresAt,
    });
  }

  await updateLastLogin(user._id);
  if (typeof fcmToken === "string" && fcmToken.length > 0) {
    await updateUserProfile(user._id, { fcmToken });
    user.fcmToken = fcmToken;
  }
  user.password = undefined;

  return {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user,
  };
};

const getClientLoginLockKey = (userId) => `login:lock:${userId}`;
const getClientLoginAttemptsKey = (userId) => `login:attempts:${userId}`;
const getTwoFactorChallengeKey = (challengeId) =>
  `login:2fa:challenge:${challengeId}`;
const getTwoFactorAttemptsKey = (challengeId) =>
  `login:2fa:attempts:${challengeId}`;
const getTwoFactorConsumedKey = (challengeId) =>
  `login:2fa:consumed:${challengeId}`;
const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// Private Function
const sendOTPForPurpose = async (email, purpose) => {
  const user = await UserFindByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (purpose === "register") {
    if (user.isEmailVerified) {
      throw new Error("Email is already verified");
    }
  }

  if (purpose === "forgot_password") {
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email first");
    }

    if (user.accountStatus !== "active") {
      throw new Error("Account is inactive");
    }
  }

  await sendOTPService(email, purpose);

  return user;
};

export const signupService = async (body) => {
  const { fullName, email, password, terms } = body;
  const existingUser = await UserFindByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }
  const hashedPassword = await hashPassword(password);

  const user = await userCreate({
    fullName,
    email,
    password: hashedPassword,
    terms,
  });
  await sendOTPService(email, "register");
  return {
    success: true,
    message: "OTP sent to your registered email",
  };
};

export const verifyEmailOTPService = async (body) => {
  const { email, otp, purpose } = body;
  const storedOTP = await getOTP(email, purpose);
  if (!storedOTP) {
    throw new Error("OTP expired");
  }
  if (storedOTP !== otp) {
    throw new Error("Invalid OTP");
  }
  await deleteOTP(email, purpose);

  if (purpose === "register") {
    const user = await verifyUserEmail(email);
    const payload = {
      id: user._id,
      clientId: user?.clientId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    // const parser = new UAParser(req.headers["user-agent"]);
    // const browser = parser.getBrowser().name;
    // const device = parser.getDevice().type || "Desktop";
    // const ipAddress = req.ip;
    await createRefreshToken({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return {
      success: true,
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user,
    };
  }
  const user = await UserFindByEmail(email);
  const resetToken = generateAccessToken({
    id: user._id,
    email: user.email,
    purpose: "reset_password",
  });

  return {
    success: true,
    message: "OTP verified successfully",
    resetToken,
    forgotPassword: true,
  };
};

export const loginService = async (body) => {
  const { email, password, fcmToken } = body;
  const user = await userFindByEmailWithPassword(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const lockKey =
    user.role === "client" ? getClientLoginLockKey(user._id) : null;
  if (lockKey && (await redisClient.exists(lockKey))) {
    const [maxAttempts, storedAttempts] = await Promise.all([
      getClientMaxLoginAttempts(user),
      redisClient.get(getClientLoginAttemptsKey(user._id)),
    ]);
    const attemptsUsed = Math.min(
      Number(storedAttempts) || maxAttempts,
      maxAttempts,
    );
    throw createAuthError(
      "Too many failed login attempts. Try again in 15 minutes.",
      429,
      {
        attemptsUsed,
        attemptsRemaining: 0,
        maxLoginAttempts: maxAttempts,
        locked: true,
      },
    );
  }

  if (!user.isEmailVerified) {
    await sendOTPService(email, "register");
    return {
      success: true,
      message: "Resend OTP on your registered email",
    };
  }
  if (user.accountStatus !== "active") {
    throw new Error("Your account is not active");
  }
  const isPasswordMatched = await comparePassword(password, user.password);
  if (!isPasswordMatched) {
    if (user.role === "client") {
      const attemptsKey = getClientLoginAttemptsKey(user._id);
      const attempts = await redisClient.incr(attemptsKey);
      if (attempts === 1) {
        await redisClient.expire(attemptsKey, LOGIN_LOCKOUT_SECONDS);
      }

      const maxLoginAttempts = await getClientMaxLoginAttempts(user);
      const attemptsRemaining = Math.max(maxLoginAttempts - attempts, 0);
      if (attempts >= maxLoginAttempts) {
        await redisClient.set(lockKey, "1", { EX: LOGIN_LOCKOUT_SECONDS });
        await redisClient.expire(attemptsKey, LOGIN_LOCKOUT_SECONDS);
        throw createAuthError(
          "Too many failed login attempts. Try again in 15 minutes.",
          429,
          {
            attemptsUsed: maxLoginAttempts,
            attemptsRemaining: 0,
            maxLoginAttempts,
            locked: true,
          },
        );
      }
      throw createAuthError("Invalid email or password", 400, {
        attemptsUsed: attempts,
        attemptsRemaining,
        maxLoginAttempts,
        locked: false,
      });
    }
    throw new Error("Invalid email or password");
  }

  if (user.role === "client") {
    await redisClient.del(
      getClientLoginAttemptsKey(user._id),
      getClientLoginLockKey(user._id),
    );
  }

  if (user.role === "admin") {
    const settings = await AdminSetting.findOne({ adminId: user._id })
      .select("twoFactorAuth")
      .lean();

    if (settings?.twoFactorAuth) {
      const challengeId = crypto.randomBytes(32).toString("hex");
      const otp = generateOTP();
      const challengeKey = getTwoFactorChallengeKey(challengeId);

      await redisClient.set(
        challengeKey,
        JSON.stringify({
          userId: user._id.toString(),
          otpHash: hashOtp(otp),
          fcmToken: fcmToken || null,
        }),
        { EX: TWO_FACTOR_CHALLENGE_SECONDS },
      );
      console.log("otp",otp)
      console.log("email",email)
      try {
        await sendOTPEmail(email, otp);
      } catch (error) {
        await redisClient.del(challengeKey);
        console.error("Admin login OTP email failed:", error);
        throw createAuthError(
          "Unable to send the verification code. Please try again.",
          503,
        );
      }

      return {
        success: true,
        requiresTwoFactor: true,
        challengeId,
        message: "Verification code sent to your email",
      };
    }
  }

  return createUserSession(user, fcmToken);
};

export const verifyAdminLoginOTPService = async ({ challengeId, otp }) => {
  const challengeKey = getTwoFactorChallengeKey(challengeId);
  const challengeValue = await redisClient.get(challengeKey);
  if (!challengeValue) {
    throw createAuthError("Verification challenge is invalid or expired", 400);
  }

  const challenge = JSON.parse(challengeValue);
  const expectedHash = Buffer.from(challenge.otpHash, "hex");
  const actualHash = Buffer.from(hashOtp(otp), "hex");
  const otpMatches =
    expectedHash.length === actualHash.length &&
    crypto.timingSafeEqual(expectedHash, actualHash);

  if (!otpMatches) {
    const attemptsKey = getTwoFactorAttemptsKey(challengeId);
    const attempts = await redisClient.incr(attemptsKey);
    if (attempts === 1) {
      await redisClient.expire(attemptsKey, TWO_FACTOR_CHALLENGE_SECONDS);
    }
    if (attempts >= TWO_FACTOR_MAX_ATTEMPTS) {
      await redisClient.del(challengeKey, attemptsKey);
      throw createAuthError(
        "Too many incorrect verification codes. Please log in again.",
        429,
      );
    }
    throw createAuthError("Invalid verification code", 400);
  }

  const consumed = await redisClient.set(
    getTwoFactorConsumedKey(challengeId),
    "1",
    { EX: TWO_FACTOR_CHALLENGE_SECONDS, NX: true },
  );
  if (consumed !== "OK") {
    throw createAuthError("Verification challenge is invalid or expired", 400);
  }

  await redisClient.del(
    challengeKey,
    getTwoFactorAttemptsKey(challengeId),
  );
  const user = await UserFindById(challenge.userId);
  if (!user || user.role !== "admin" || user.accountStatus !== "active") {
    throw createAuthError("Admin account is unavailable", 403);
  }

  return createUserSession(user, challenge.fcmToken);
};

export const resendOTPService = async (body) => {
  const { email, purpose } = body;

  await sendOTPForPurpose(email, purpose);

  return {
    success: true,
    message: "Resend OTP on your registered email",
  };
};

export const forgotPasswordService = async (body) => {
  const { email } = body;

  await sendOTPForPurpose(email, "forgot_password");

  return {
    success: true,
    message: "OTP sent to your registered email",
  };
};

export const resetPasswordService = async (body) => {
  const { resetToken, password } = body;
  let payload;
  try {
    payload = verifyAccessToken(resetToken);
  } catch (error) {
    throw new Error("Invalid or expired reset token");
  }

  if (payload.purpose !== "reset_password") {
    throw new Error("Invalid reset token");
  }

  const user = await userFindByEmailWithPassword(payload.email);
  if (!user) {
    throw new Error("User not found");
  }

  const isSamePassword = await comparePassword(password, user.password);
  if (isSamePassword) {
    throw new Error("New password cannot be the same as your current password");
  }

  const hashedPassword = await hashPassword(password);
  await userUpdatePassword(user._id, hashedPassword);

  return {
    success: true,
    message: "Password reset successfully",
  };
};

export const logoutService = async (body) => {
  const { refreshToken } = body;

  const token = await findRefreshToken(refreshToken);

  if (!token) {
    throw new Error("Invalid refresh token");
  }

  await deleteRefreshToken(refreshToken);

  return {
    success: true,
    message: "Logout successful",
  };
};

export const changePasswordService = async (body) => {
  const { userId, currentPassword, newPassword } = body;

  const user = await userFindByIdWithPassword(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    throw new Error("New password cannot be the same as current password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await userUpdatePassword(user._id, hashedPassword);
  await deleteRefreshToken(userId);
  return {
    success: true,
    message: "Password changed successfully",
  };
};

export const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
  if (!decoded?.id || !decoded?.role) {
    throw new Error("Invalid refresh token");
  }
  const storedToken = await findRefreshToken(refreshToken);
  if (!storedToken) {
    throw new Error("Refresh token is invalid or revoked");
  }
  const user = await findUserForRefreshToken(decoded);
  if (!user) {
    throw new Error("User not found");
  }
  const accessToken = generateAccessToken({
    id: user.role === "client" ? user.clientId : user._id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
  };
};
