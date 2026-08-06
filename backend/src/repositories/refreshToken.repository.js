import RefreshToken from "../models/RefreshToken.js";

export const createRefreshToken = async (payload) => {
  return await RefreshToken.create(payload);
};

export const findRefreshToken = async (refreshToken) => {
  return await RefreshToken.findOne({ refreshToken });
};

export const deleteRefreshToken = async (refreshToken) => {
  return await RefreshToken.findOneAndDelete({
    refreshToken,
  });
};

export const deleteAllRefreshTokens = async (userId) => {
  return await RefreshToken.deleteMany({
    userId,
  });
};
