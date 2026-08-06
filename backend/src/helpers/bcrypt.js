import bcrypt from "bcrypt";
import env from "../config/env.js";

const SALT_ROUNDS = Number(env.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};