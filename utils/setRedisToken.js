import { redis } from "../database/redis.js";
const storeUserRefreshToken = async (userId, userRefreshToken) => {
  await redis.set(
    `user_refresh_token:${userId}`,
    userRefreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const storeAdminRefreshToken = async (email, adminRefreshToken) => {
  await redis.set(
    `admin_fresh_token:${email}`,
    adminRefreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

export { storeUserRefreshToken, storeAdminRefreshToken };
