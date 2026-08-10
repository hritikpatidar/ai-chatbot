import {
  UserFindByEmail,
  userCreate,
  verifyUserEmail,
  UserFindById,
  userFindByEmailWithPassword,
  updateLastLogin,
  userUpdatePassword,
} from "../repositories/user.repository.js";

import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { generateOTP } from "../helpers/otp.js";

import { sendOTPEmail } from "./email.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../helpers/jwt.js";
import {
  createRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
} from "../repositories/refreshToken.repository.js";
import { deleteOTP, getOTP, saveOTP } from "../helpers/redisOTP.js";
import { sendOTPService } from "./otp.service.js";

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
  const { email, password } = body;

  const user = await userFindByEmailWithPassword(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    await sendOTPService(email, "register");
    return {
      success: true,
      message: "Resend OTP on your registered email",
    };
    // throw new Error("Please verify your email first");
  }

  if (user.accountStatus !== "active") {
    throw new Error("Your account is not active");
  }

  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await createRefreshToken({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await updateLastLogin(user._id);
  user.password = undefined;

  return {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user,
  };
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

