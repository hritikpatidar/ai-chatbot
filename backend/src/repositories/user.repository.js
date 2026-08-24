import User from "../models/User.js";

export const UserFindById = async (id) => {
  return await User.findById(id);
};

export const UserFindByEmail = async (email) => {
  return await User.findOne({ email });
};

export const userFindByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const userFindByIdWithPassword = async (userId) => {
  return await User.findById(userId).select("+password");
};

export const userCreate = async (payload) => {
  return await User.create(payload);
};

export const updateUserProfile = async (userId, data) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");
};

export const userDelete = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const verifyUserEmail = async (email) => {
  return await User.findOneAndUpdate(
    { email },
    {
      isEmailVerified: true,
    },
    {
      new: true,
    },
  );
};

export const updateLastLogin = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    {
      lastLogin: new Date(),
    },
    {
      new: true,
    },
  );
};

export const userUpdatePassword = async (id, password) => {
  return await User.findByIdAndUpdate(
    id,
    {
      password,
    },
    {
      new: true,
    },
  );
};

export const findClientUserByClientId = async (clientId) => {
  return await User.findOne({
    clientId,
    role: "client",
    accountStatus: "active",
  })
    .select("-password")
    .lean();
};

export const findUserForRefreshToken = async (decoded) => {
  if (!decoded?.id || !decoded?.role) {
    return null;
  }

  if (decoded.role === "client") {
    return await User.findOne({
      clientId: decoded.id,
      role: "client",
      accountStatus: "active",
    }).select("-password");
  }

  return await User.findById(decoded.id).select("-password");
};

export const deleteUserByClientId = async (clientId, session) => {
  return await User.findOneAndDelete({
    clientId,
  }).session(session);
};
