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

export const userCreate = async (payload) => {
  return await User.create(payload);
};

export const userUpdate = async (id, payload) => {
  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
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
    }
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
    }
  );
};
